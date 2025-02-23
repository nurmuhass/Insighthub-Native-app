// BuyAirtime.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Switch,
  ActivityIndicator,
  ScrollView,
  Modal
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import ReAuthModalWrapper from "../../../components/ReAuthModalWrapper";
import { TouchableHighlight } from "react-native";
import { FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Contacts from 'expo-contacts';
// Helper function to generate a transaction reference
const generateTransRef = () => "TRANS" + Date.now();

const BuyAirtimeScreen = () => {
  const router = useRouter();
  const ref = generateTransRef();
  // State variables
  const [networks, setNetworks] = useState([]);
  const [airtimeDiscountData, setAirtimeDiscountData] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedNetworkName, setSelectedNetworkName] = useState("");
  const [availableAirtimeTypes, setAvailableAirtimeTypes] = useState([]);
  const [selectedAirtimeType, setSelectedAirtimeType] = useState("");
  const [phone, setPhone] = useState("");
  const [airtimeAmount, setAirtimeAmount] = useState(""); // user-entered amount
  const [amountToPay, setAmountToPay] = useState("");    // calculated value
  const [discountDisplay, setDiscountDisplay] = useState(""); // e.g. "20%"
  const [disableValidator, setDisableValidator] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("1"); // sType ("1"=regular, "2"=agent, "3"=vendor)
 const [reauthVisible, setReauthVisible] = useState(false);
   const [contacts, setContacts] = useState([]);
 const [modalVisible, setModalVisible] = useState(false);

  // --- Fetch Networks and Airtime Discount Data on mount ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "No access token found");
          return;
        }
        // Retrieve the rawApiResponse from AsyncStorage
        const rawApiResponse = await AsyncStorage.getItem("rawApiResponse");
        
        if (rawApiResponse) {
          try {
            // Parse the rawApiResponse JSON string into an object
            const parsedResponse = JSON.parse(rawApiResponse);
      
            // Extract the sType value from the parsed object
            const storedSType = parsedResponse.sType;
      
            if (storedSType) {
              setUserType(storedSType);
           
            } else {
              console.log("sType not found in rawApiResponse; defaulting to 1");
            }
          } catch (error) {
            console.error("Error parsing rawApiResponse:", error);
          }
        } else {
          console.log("rawApiResponse not found in storage; defaulting to 1");
        }
      
      
        const response = await fetch("https://insighthub.com.ng/api/airtime/getairtimediscount.php", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Token ${token}`
          }
        });
        const json = await response.json();
        // Expect json to be in the form:
        // { status: "success", networks: [...], airtimeDiscount: [...] }
        if (json.status === "success") {
          // Filter networks to only those with networkStatus "On"
          const activeNetworks = json.networks.filter(net => net.networkStatus === "On");
          setNetworks(activeNetworks);
          setAirtimeDiscountData(json.airtimeDiscount || []);
        } else {
          Alert.alert("Error", "Could not load airtime data");
        }
      } catch (error) {
        console.error("Error fetching airtime data:", error);
        Alert.alert("Error", "An error occurred while fetching airtime data.");
      }
    };
    fetchData();
  }, []);

  // --- When a network is selected, update available airtime types ---
  useEffect(() => {
    if (!selectedNetwork) {
      setAvailableAirtimeTypes([]);
      setSelectedAirtimeType("");
      return;
    }
    // Find the selected network object
    const netObj = networks.find(net => net.nId == selectedNetwork);
    setSelectedNetworkName(netObj ? netObj.network : "");

    if (!netObj) return;

    let types = [];
    // Check network attributes (adjust property names as per your backend)
    if (netObj.vtuStatus === "On") types.push("VTU");
    if (netObj.sharesellStatus === "On") types.push("Share And Sell");

    setAvailableAirtimeTypes(types);
    // Auto-select the first available type if not already selected:
    if (types.length > 0) {
      setSelectedAirtimeType(types[0]);
    } else {
      setSelectedAirtimeType("");
    }
    // Reset calculated fields
    setAirtimeAmount("");
    setAmountToPay("");
    setDiscountDisplay("");
  }, [selectedNetwork, networks]);

  // --- When airtime amount changes, recalc discount and amount to pay ---
  useEffect(() => {
    // Only calculate if both a network and airtime type are selected, and amount is provided.
    if (!selectedNetwork || !selectedAirtimeType || !airtimeAmount) {
      setAmountToPay("");
      setDiscountDisplay("");
      return;
    }
    // Loop through airtimeDiscountData to find a matching discount rule
    let discountValue = 0;
    for (let i = 0; i < airtimeDiscountData.length; i++) {
      const rule = airtimeDiscountData[i];
      // Compare the rule's network and type with selected values.
      // (Assumes rule.aNetwork equals network id and rule.aType equals airtime type)
      if (rule.aNetwork == selectedNetwork && rule.aType === selectedAirtimeType) {
        // Determine discount based on user type.
        if (userType === "3") {
          discountValue = parseInt(rule.aVendorDiscount);
        } else if (userType === "2") {
          discountValue = parseInt(rule.aAgentDiscount);
        } else {
          discountValue = parseInt(rule.aUserDiscount);
        }
        break;
      }
    }
    // If discountValue is not found, default to 100% (i.e., no discount)
    if (!discountValue) discountValue = 100;
    // Calculate amount to pay: if discountValue represents the percentage to charge,
    // then amountToPay = (airtimeAmount * discountValue) / 100
    const calculatedAmount = (parseFloat(airtimeAmount) * discountValue) / 100;
    // Calculate displayed discount percentage (assuming discount is 100 - discountValue)
    const discountDisplayVal = 100 - discountValue;
    setAmountToPay("N" + calculatedAmount);
    setDiscountDisplay(discountDisplayVal + "%");
  }, [airtimeAmount, selectedNetwork, selectedAirtimeType, airtimeDiscountData, userType]);

  // --- Handle Airtime Purchase Submission ---
  const handleBuyAirtime = async () => {
   
    // Generate a transaction reference
  

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No access token found");
        setLoading(false);
        return;
      }
      // Build the payload. Adjust keys as expected by your backend.
      const payload = {
        network: selectedNetwork,
        phone: phone,
        amount: airtimeAmount,
        airtime_type: selectedAirtimeType, // "VTU" or "Share And Sell"
        ported_number: "true",
        ref: ref
      };

      const response = await fetch("https://insighthub.com.ng/api/airtime/index.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const resJson = await response.json();
      console.log("Buy Airtime Response:", resJson);
      if (resJson.status === "success") {
        Alert.alert("Success", "Airtime purchase successful");
        router.replace({
          pathname: "Dashboard/receipt",
          params: { transaction: JSON.stringify(combinedData) }
        });
      } else {
        Alert.alert("Error", resJson.msg || "Airtime purchase failed");
      }
    } catch (error) {
      console.error("Error buying airtime:", error);
      Alert.alert("Error", "An error occurred while processing your request");
    } finally {
      setLoading(false);
    }
  };


  // This function is called when re-authentication succeeds.
  const onReauthSuccess = () => {
    setReauthVisible(false);
    // Now proceed with the purchase action.
    handleBuyAirtime();
  };

  // When user taps Buy Data, instead of directly calling handleBuyData, show modal.
  const combinedData = {network: selectedNetworkName, phone: phone,desc:selectedAirtimeType + ' ' + airtimeAmount,amountToPay: amountToPay,ref: ref, date: new Date().toLocaleString() };
  const onBuyAirtimePress = () => {

    if (!selectedNetwork) {
      Alert.alert("Error", "Please select a network");
      return;
    }
    if (!selectedAirtimeType) {
      Alert.alert("Error", "Please select an airtime type");
      return;
    }
    if (!phone) {
      Alert.alert("Error", "Please enter a phone number");
      return;
    }
    if (!airtimeAmount) {
      Alert.alert("Error", "Please enter the airtime amount");
      return;
    }

    setReauthVisible(true);

  };

  const fetchContacts = async () => {
    console.log("Fetching contacts...");
  
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Permission Denied", "Permission to access contacts was denied");
      return;
    }
  
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });
  
    if (data.length > 0) {
      const filteredContacts = data.filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0);
      if (filteredContacts.length === 0) {
        Alert.alert("No Contacts", "No contacts with phone numbers found");
        return;
      }
      setContacts(filteredContacts);
      setModalVisible(true);
    } else {
      Alert.alert("No Contacts", "No contacts found on this device");
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Buy Airtime</Text>
      
      {/* Network Picker */}
      <Text style={styles.subHeader}>Select Network</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedNetwork}
          onValueChange={(itemValue) => setSelectedNetwork(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Network" value="" />
          {networks.map((net) => (
            <Picker.Item
              key={net.nId}
              label={net.network}
              value={net.nId}
              // Optionally, you can pass extra data using a custom field if needed.
            />
          ))}
        </Picker>
      </View>
      
      {/* Airtime Type Picker */}
      <Text style={styles.subHeader}>Select Airtime Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedAirtimeType}
          onValueChange={(itemValue) => setSelectedAirtimeType(itemValue)}
          style={styles.picker}
        >
          {availableAirtimeTypes.length === 0 ? (
            <Picker.Item label="Select Type" value="" />
          ) : (
            availableAirtimeTypes.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))
          )}
        </Picker>
      </View>
      
      {/* Phone Number Input */}
      <Text style={styles.subHeader}>Phone Number</Text>
 <View style={{position:'relative'}}>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      
      <TouchableOpacity onPress={fetchContacts}  style={{position:'absolute',top:10,right:5}}>
      <MaterialIcons name="contacts" size={24} color="black" />
      </TouchableOpacity>
     
      </View>

      {/* Airtime Amount Input */}
      <Text style={styles.subHeader}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={airtimeAmount}
        onChangeText={setAirtimeAmount}
      />
      
      {/* Calculated Amount To Pay */}
      <Text style={styles.subHeader}>Amount To Pay</Text>
      <TextInput
        style={styles.input}
        value={amountToPay}
        editable={false}
      />
      
      {/* Discount Display */}
      <Text style={styles.subHeader}>Discount</Text>
      <TextInput
        style={styles.input}
        value={discountDisplay}
        editable={false}
      />

      {/* Disable Number Validator Switch */}
      {/* <View style={styles.switchContainer}>
        <Text style={styles.label}>Disable Number Validator</Text>
        <Switch
          value={disableValidator}
          onValueChange={setDisableValidator}
        />
      </View> */}
      
      {/* Buy Airtime Button */}
      <TouchableOpacity style={styles.button} onPress={onBuyAirtimePress} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Buy Airtime</Text>
        )}
      </TouchableOpacity>

      <ReAuthModalWrapper
  visible={reauthVisible}
  onSuccess={onReauthSuccess} // this calls the purchase function
  onCancel={() => setReauthVisible(false)}
  combinedData={combinedData} // pass the combinedData to the modal
/>



<Modal
  animationType="slide"
  transparent={false}
  visible={modalVisible}
  onRequestClose={() => setModalVisible(false)}
>
  <FlatList
    data={contacts}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <TouchableHighlight
        underlayColor="#ddd"
        onPress={() => {
          setPhone(item.phoneNumbers[0].number); // Set the phone number
          setModalVisible(false);
        }}
      >
        <Text style={{ padding: 20 }}>{item.name} - {item.phoneNumbers[0].number}</Text>
      </TouchableHighlight>
    )}
  />
</Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 10, color: "#7734eb" },
  subHeader: { fontSize: 16, marginTop: 10, marginBottom: 5, fontWeight: "bold", color: "#333" },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 15 },
  picker: { height: 50, width: "100%" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  switchContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "bold", color: "#333" },
  button: { backgroundColor: "#7734eb", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default BuyAirtimeScreen;
