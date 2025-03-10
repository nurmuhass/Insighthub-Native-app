// BuyData page
import React, { useContext, useEffect, useState } from "react";
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
  TouchableHighlight,
  FlatList,
  Modal,contex
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ReAuthModalWrapper from "../../../components/ReAuthModalWrapper";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as Contacts from 'expo-contacts';
import { ThemeContext } from "../../../ThemeContext"; 
import { getStatusBarHeight } from "react-native-status-bar-height";
// Helper function to generate a transaction reference
const generateTransRef = () => "TRANS" + Date.now();

const BuyDataScreen = () => {
  const router = useRouter();
  const ref = generateTransRef();
  // State variables
  const [networks, setNetworks] = useState([]);
  const [dataPlans, setDataPlans] = useState([]);
  const [dataTypes, setDataTypes] = useState([]); // Data type options based on network attributes
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedNetworkName, setSelectedNetworkName] = useState("");
  const [selectedDataType, setSelectedDataType] = useState("");
  const [filteredDataPlans, setFilteredDataPlans] = useState([]);
  const [selectedDataPlan, setSelectedDataPlan] = useState("");
  const [selectedDataPlanName, setSelectedDataPlanName] = useState("");
  const [phone, setPhone] = useState("");
  const [amountToPay, setAmountToPay] = useState("");
  const [disableValidator, setDisableValidator] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState("1"); // sType: "1" = regular, "2" = agent, "3" = vendor
  const [reauthVisible, setReauthVisible] = useState(false);
  const [contacts, setContacts] = useState([]);
const [modalVisible, setModalVisible] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  // 1. Fetch networks and data plans from your endpoint
  useEffect(() => {
    const fetchNetworksAndPlans = async () => {
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
        
        
        const response = await fetch("https://insighthub.com.ng/api/data/index.php", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Token ${token}`
          }
        });
        const json = await response.json();

        if (json.status === "success") {
      
          // Filter networks to include only those with networkStatus "On"
          const activeNetworks = json.networks.filter(net => net.networkStatus === "On");
          setNetworks(activeNetworks);
          setDataPlans(json.dataPlans || []);
        } else {
          Alert.alert("Error", "Could not load networks and data plans");
        }
      } catch (error) {
        console.error("Error fetching networks and data plans:", error);
        Alert.alert("Error", "An error occurred while fetching data");
      }
    };

    fetchNetworksAndPlans();
  }, []);

  // 2. When a network is selected, update available data types based on its attributes
  useEffect(() => {
    if (!selectedNetwork) {
      setDataTypes([]);
      setSelectedDataType("");
      setFilteredDataPlans([]);
      setAmountToPay("");
      return;
    }
    // Find the selected network object
    const netObj = networks.find(net => net.nId == selectedNetwork);
    setSelectedNetworkName(netObj ? netObj.network : "");
    if (!netObj) return;
    
    // Build available data types from network attributes.
    // The website uses attributes: smeStatus, giftingStatus, corporateStatus, vtu, sharesell.
    let types = [];
    if (netObj.smeStatus === "On") types.push("SME");
    if (netObj.giftingStatus === "On") types.push("Gifting");
    if (netObj.corporateStatus === "On") types.push("Corporate");
    if (netObj.vtu === "On") types.push("VTU");
    if (netObj.sharesell === "On") types.push("Share And Sell");
    
    setDataTypes(types);
    // Auto-select the first available type if any.
    if (types.length > 0) {
      setSelectedDataType(types[0]);
    } else {
      setSelectedDataType("");
    }
    setSelectedDataPlan("");
    setAmountToPay("");
  }, [selectedNetwork, networks]);

  // 3. When selected data type changes, filter data plans
  useEffect(() => {
    if (!selectedNetwork || !selectedDataType) {
      setFilteredDataPlans([]);
      setSelectedDataPlan("");
      setAmountToPay("");
      return;
    }
    // Each data plan is assumed to have:
    // pId, datanetwork, type, name, day, vendorprice, agentprice, userprice.
    const filtered = dataPlans.filter(plan =>
      plan.datanetwork == selectedNetwork && plan.type === selectedDataType
    );
    setFilteredDataPlans(filtered);
    setSelectedDataPlan("");
    setAmountToPay("");
  }, [selectedNetwork, selectedDataType, dataPlans]);

  // 4. Handle data plan selection to set the price
  const handleDataPlanChange = (planId) => {
    setSelectedDataPlan(planId);
   
    const plan = filteredDataPlans.find(p => p.pId == planId);
    if (plan) {
      let price = plan.userprice; // default for regular users
      setSelectedDataPlanName( plan.type + " " +  plan.name + " " + plan.day + " Days");
      if (userType === "3") {
        price = plan.vendorprice;
      } else if (userType === "2") {
        price = plan.agentprice;
      }
      setAmountToPay("N" + price);
    } else {
      setAmountToPay("");
    }
  };

  // 5. Handle the purchase submission
  const handleBuyData = async () => {
   
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No access token found");
        setLoading(false);
        return;
      }
      // Build payload to match backend expectations
      const body = {
        network: selectedNetwork,
        phone: phone,
        data_plan: selectedDataPlan,
        ref: ref,
        ported_number:  "true",
      };
     

      const response = await fetch("https://insighthub.com.ng/api/data/index.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(body)
      });
      const resJson = await response.json();
      console.log("Buy Data Response:", resJson);
      if (resJson.status === "success") {
        Alert.alert("Success", "Data purchase successful");
        // Optionally reset form or navigate away.
        router.replace({
          pathname: "Dashboard/receipt",
          params: { transaction: JSON.stringify(combinedData) }
        });
      } else {
        Alert.alert("Error", resJson.msg || "Data purchase failed");
      }
    } catch (error) {
      console.error("Error buying data:", error);
      Alert.alert("Error", "An error occurred while processing your request");
    } finally {
      setLoading(false);
    }
  };


  // This function is called when re-authentication succeeds.
  const onReauthSuccess = () => {
    setReauthVisible(false);
    // Now proceed with the purchase action.
    handleBuyData();
  };

  // When user taps Buy Data, instead of directly calling handleBuyData, show modal.
  const combinedData = {network: selectedNetworkName, phone: phone,desc:selectedDataPlanName,amountToPay: amountToPay,ref: ref, date: new Date().toLocaleString()};
  const onBuyDataPress = () => {
    if (!selectedNetwork) {
      Alert.alert("Error", "Please select a network");
      return;
    }
    if (!selectedDataPlan) {
      Alert.alert("Error", "Please select a data plan");
      return;
    }
    if (!phone) {
      Alert.alert("Error", "Please enter a phone number");
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
    <ScrollView style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
     
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.back()} style={{   }}>
              <Ionicons name="arrow-back" size={24} color={theme === "dark" ? "#fff" : "#000"}/>
            </TouchableOpacity>
         
            <Text style={[styles.header, { color: theme === "dark" ? "#fff" : "#000" }]}>Buy Data</Text>    
 </View>
      {/* Select Network */}
      <Text style={[styles.subHeader, { color: theme === "dark" ? "#fff" : "#000" }]}>Select Network</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedNetwork}
          onValueChange={(itemValue) => setSelectedNetwork(itemValue)}
          style={[styles.picker, { color: theme === "dark" ? "#fff" : "#000" }]}
        >
          <Picker.Item label="Select Network" value="" />
          {networks.map(net => (
            <Picker.Item
              key={net.nId}
              label={net.network}
              value={net.nId}
            />
          ))}
        </Picker>
      </View>
      
      {/* Select Data Type */}
      <Text style={[styles.subHeader, { color: theme === "dark" ? "#fff" : "#000" }]}>Select Data Type</Text>
      <View style={[styles.pickerContainer,, { color: theme === "dark" ? "#fff" : "#000" }]}>
        <Picker
          selectedValue={selectedDataType}
          onValueChange={(itemValue) => setSelectedDataType(itemValue)}
          style={[styles.picker, { color: theme === "dark" ? "#fff" : "#000" }]}
        >
          {dataTypes.length === 0 ? (
            <Picker.Item label="Select Type" value="" />
          ) : (
            dataTypes.map(type => (
              <Picker.Item key={type} label={type} value={type} />
            ))
          )}
        </Picker>
      </View>
      
      {/* Select Data Plan */}
      <Text style={[styles.subHeader, { color: theme === "dark" ? "#fff" : "#000" }]}>Select Data Plan</Text>
      <View style={[styles.pickerContainer, { color: theme === "dark" ? "#fff" : "#000" }]}>
        <Picker
          selectedValue={selectedDataPlan}
          onValueChange={(itemValue) => handleDataPlanChange(itemValue)}
          style={[styles.picker, { color: theme === "dark" ? "#fff" : "#000" }]}
        >
          {filteredDataPlans.length === 0 ? (
            <Picker.Item label="No plans available" value="" />
          ) : (
            filteredDataPlans.map(plan => (
              <Picker.Item
                key={plan.pId}
                label={`${plan.name} ${plan.type} (N${userType === "3" ? plan.vendorprice : userType === "2" ? plan.agentprice : plan.userprice}) (${plan.day} Days)`}
                value={plan.pId}
                
              />
            ))
          )}
        </Picker>
      </View>
      
      {/* Phone Number */}
      <Text style={[styles.subHeader, { color: theme === "dark" ? "#fff" : "#000" }]}>Phone Number</Text>
   
       <View style={{position:'relative'}}>
       <TextInput
        style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TouchableOpacity onPress={fetchContacts}  style={{position:'absolute',top:10,right:5}}>
      <MaterialIcons name="contacts" size={24} color="black" />
      </TouchableOpacity>
     
      </View>
      
      {/* Amount To Pay */}
      <Text style={[styles.subHeader, { color: theme === "dark" ? "#fff" : "#000" }]}>Amount To Pay</Text>
      <TextInput
        style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
        value={amountToPay}
        editable={false}
      />

      {/* Disable Validator */}
      {/* <View style={styles.switchContainer}>
        <Text style={styles.label}>Disable Number Validator</Text>
        <Switch
          value={disableValidator}
          onValueChange={setDisableValidator}
        />
      </View> */}

      {/* Buy Data Button */}
      <TouchableOpacity style={styles.button} onPress={onBuyDataPress} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Buy Data</Text>
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
        const formattedPhone = item.phoneNumbers[0].number.replace(/\s/g, ''); // Remove spaces
        setPhone(formattedPhone);
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
  container: { flex: 1, paddingTop: getStatusBarHeight(),paddingHorizontal:15,  backgroundColor: "#fff" },
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginLeft: 10, color: "#7734eb" },
  subHeader: { fontSize: 16, marginTop: 10, marginBottom: 5, fontWeight: "bold", color: "#333" },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 15 },
  picker: { height: 50, width: "100%" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  switchContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "bold", color: "#333" },
  button: { backgroundColor: "#7734eb", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default BuyDataScreen;
