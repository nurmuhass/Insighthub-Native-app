// ElectricityScreen.js

import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import ReAuthModalWrapper from '../../../components/ReAuthModalWrapper';
import { ThemeContext } from "../../../ThemeContext"; 
import { Ionicons } from '@expo/vector-icons';

const ElectricityScreen = () => {
  const router = useRouter();
  const { theme, toggleTheme } = useContext(ThemeContext);
  // State for fetched data and form fields
  const [providers, setProviders] = useState([]);
  const [electricityCharge, setElectricityCharge] = useState(""); // from site settings
  const [selectedProvider, setSelectedProvider] = useState("");
  const [meterType, setMeterType] = useState(""); // "prepaid" or "postpaid"
  const [phone, setPhone] = useState("");
  const [meterNumber, setMeterNumber] = useState("");
  const [amount, setAmount] = useState(""); // user-entered amount
  const [amountToPay, setAmountToPay] = useState("");
  const [loading, setLoading] = useState(false);

  
  // Fetch electricity providers and charge from API endpoint on mount
  useEffect(() => {
    const fetchElectricityData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          Alert.alert("Error", "No access token found");
          return;
        }
        const response = await fetch("https://insighthub.com.ng/api/electricity/getelectricity.php", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Token ${token}`
          }
        });
        const json = await response.json();
   
        if (json.status === "success") {
          // Set providers (assuming each provider has fields: eId, provider, providerStatus)
          const activeProviders = json.electricityProvider.filter(provider => provider.providerStatus === "On");
          setProviders(activeProviders);
          setElectricityCharge(json.electricityCharges);
        } else {
          Alert.alert("Error", json.msg || "Failed to load electricity data");
        }
      } catch (error) {
        console.error("Error fetching electricity data:", error);
        Alert.alert("Error", "An error occurred while fetching electricity data");
      }
    };
    
    fetchElectricityData();
  }, []);
  
  // Calculate Amount To Pay when the amount changes.
  // Total = entered amount + electricity charge.
  useEffect(() => {
    if (amount !== "" && electricityCharge !== "") {
      const amt = parseFloat(amount);
      const charge = parseFloat(electricityCharge);
      const total = amt + charge;
      setAmountToPay("N" + total);
    } else {
      setAmountToPay("");
    }
  }, [amount, electricityCharge]);
  
  // Handle form submission (verify meter details)
  const handleSubmit = async () => {
    // Basic validation
    if (!selectedProvider) {
      Alert.alert("Error", "Please select an Electricity Provider");
      return;
    }
    if (!meterType) {
      Alert.alert("Error", "Please select a Meter Type");
      return;
    }
    if (!phone) {
      Alert.alert("Error", "Please enter the Customer Phone Number");
      return;
    }
    if (!meterNumber) {
      Alert.alert("Error", "Please enter the Meter Number");
      return;
    }
    if (!amount) {
      Alert.alert("Error", "Please enter the Amount");
      return;
    }
    if (parseFloat(amount) < 1000) {
      Alert.alert("Error", "Minimum Unit Purchase is N1000");
      return;
    }
    
    const transRef = "ELEC" + Date.now();
    const payload = {
      provider: selectedProvider,
      metertype: meterType,
      phone: phone,
      meternumber: meterNumber,
      amount: amount,
      amounttopay: amountToPay,
      ref: transRef,
      providerName: providers.find(p => p.eId === selectedProvider)?.provider || "N/A"
    };
    
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No access token found");
        setLoading(false);
        return;
      }
      const response = await fetch("https://insighthub.com.ng/api/electricity/verify/index.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const resJson = await response.json();
      console.log("Electricity verification response:", resJson);
      if (resJson.status === "success") {
        // Alert.alert("Success", "Meter verification successful");
        // Navigate to next step if needed
        const combinedData = { ...payload, Customer_Name: resJson.Customer_Name };
        router.push({
          pathname: 'Dashboard/ConfirmElectricity',
          params: { verificationData: JSON.stringify(combinedData) }
        });
        
        
      } else {
        Alert.alert("Error", resJson.msg || "Meter verification failed");
      }
    } catch (error) {
      console.error("Error verifying meter:", error);
      Alert.alert("Error", "An error occurred while verifying meter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
     
      
  <View style={{ flexDirection: 'row', alignItems: 'center',marginBottom:20 }}>
            <TouchableOpacity onPress={() => router.back()} style={{   }}>
              <Ionicons name="arrow-back" size={24} color={theme === "dark" ? "#fff" : "#000"}/>
            </TouchableOpacity>
         
            <Text style={[styles.header, { color: theme === "dark" ? "#fff" : "#000" }]}>Electricity Purchase</Text>    
 </View>

      {/* Provider Picker */}
      <Text style={[styles.subHeader, { color: theme === "dark" ? "#fff" : "#000" }]}>Select Provider</Text>
      <View style={[styles.pickerContainer, { color: theme === "dark" ? "#fff" : "#000" }]}>
        <Picker
          selectedValue={selectedProvider}
          onValueChange={(itemValue) => setSelectedProvider(itemValue)}
          style={[styles.picker, { color: theme === "dark" ? "#fff" : "#000" }]}
        >
          <Picker.Item label="Select Provider" value="" />
          {providers.map(provider => (
            <Picker.Item
              key={provider.eId}
              label={provider.provider}
              value={provider.eId}
            />
          ))}
        </Picker>
      </View>
      
      {/* Meter Type Picker */}
      <Text style={[styles.subHeader, { color: theme === "dark" ? "#fff" : "#000" }]}>Meter Type</Text>
      <View style={[styles.pickerContainer, { color: theme === "dark" ? "#fff" : "#000" }]}>
        <Picker
          selectedValue={meterType}
          onValueChange={(itemValue) => setMeterType(itemValue)}
          style={[styles.picker, { color: theme === "dark" ? "#fff" : "#000" }]}
        >
          <Picker.Item label="Select Meter Type" value="" />
          <Picker.Item label="Prepaid" value="prepaid" />
          <Picker.Item label="Postpaid" value="postpaid" />
        </Picker>
      </View>
      
      {/* Customer Phone Number */}
      <Text style={[styles.subHeader, { color: theme === "dark" ? "#fff" : "#000" }]}>Customer Phone Number</Text>
      <TextInput
        style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      
      {/* Meter Number */}
      <Text style={[styles.subHeader, { color: theme === "dark" ? "#fff" : "#000" }]}>Meter Number</Text>
      <TextInput
        style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
        placeholder="Enter meter number"
        keyboardType="numeric"
        value={meterNumber}
        onChangeText={setMeterNumber}
      />
      
      {/* Amount Input */}
      <Text style={[styles.subHeader, { color: theme === "dark" ? "#fff" : "#000" }]}>Amount</Text>
      <TextInput
        style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      
      {/* Amount To Pay */}
      <Text style={[styles.subHeader, { color: theme === "dark" ? "#fff" : "#000" }]}>Amount To Pay</Text>
      <TextInput
        style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
        value={amountToPay}
        editable={false}
      />
      
      {/* Display Electricity Charge Note */}
      <Text style={[styles.note, { color: theme === "dark" ? "#fff" : "#000" }]}>
        Note: Transaction attracts a service charge of N{electricityCharge} only.{"\n"}
        Minimum Unit Purchase is N1000.
      </Text>
      
      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.buttonText, { color: theme === "dark" ? "#fff" : "#fff" }]}>Continue</Text>
        )}
      </TouchableOpacity>

    </ScrollView>
  );
}; 
// cannot convert null value to object
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginLeft: 15, color: "#7734eb" },
  subHeader: { fontSize: 16, marginTop: 10, marginBottom: 5, fontWeight: "bold", color: "#333" },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 15 },
  picker: { height: 50, width: "100%" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  note: { fontSize: 14, color: "#555", marginBottom: 15 },
  button: { backgroundColor: "#7734eb", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});

export default ElectricityScreen;
