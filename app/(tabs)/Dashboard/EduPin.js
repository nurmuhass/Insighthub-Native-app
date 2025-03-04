// BuyExamPin.js

import React, { useContext,useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import ReAuthModalWrapper from '../../../components/ReAuthModalWrapper';
import { ThemeContext } from "../../../ThemeContext"; 

// Helper function to generate a transaction reference
const generateTransRef = () => "EXAMPIN" + Date.now();

const BuyExamPin = () => {
  const router = useRouter();
    const { theme, toggleTheme } = useContext(ThemeContext);
  // State variables
  const [examProviders, setExamProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [quantity, setQuantity] = useState("");
  const [providerName, setProviderName] = useState("");
  const [amountToPay, setAmountToPay] = useState("");
  const [loading, setLoading] = useState(false);
      const [reauthVisible, setReauthVisible] = useState(false);
      const transRef = generateTransRef();
  // Fetch exam providers on mount
  useEffect(() => {
    const fetchExamProviders = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "No access token found");
          return;
        }
        const response = await fetch("https://insighthub.com.ng/api/exam/getexamprovider.php", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Token ${token}`
          }
        });
        const json = await response.json();
        console.log("Exam Providers API response:", json);
        if (json.status === "success") {
          setExamProviders(json.examProviders || []);
        } else {
          Alert.alert("Error", json.msg || "Failed to load exam providers");
        }
      } catch (error) {
        console.error("Error fetching exam providers:", error);
        Alert.alert("Error", "An error occurred while fetching exam providers");
      }
    };
    fetchExamProviders();
  }, []);
  
  // When quantity or selected provider changes, calculate amountToPay
  useEffect(() => {
    if (!selectedProvider || !quantity) {
      setAmountToPay("");
      return;
    }
    // Find the selected provider details
    const provider = examProviders.find(p => p.eId == selectedProvider);
    if (provider) {
      const price = parseFloat(provider.price) || 0;
      setProviderName(provider.provider);

      
      const qty = parseFloat(quantity) || 0;
      console.log("Price:", price, "Quantity:", qty);
      const total = price * qty;
      console.log("Calculated Total:", total);
      setAmountToPay("N" + total);
    } else {
      setAmountToPay("");
    }
  }, [selectedProvider, quantity, examProviders]);
  
  // Handle purchase submission
  const handlePurchase = async () => {
    // Validate required fields
    if (!selectedProvider) {
      Alert.alert("Error", "Please select an exam provider");
      return;
    }
    if (!quantity || parseFloat(quantity) <= 0) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }
    if (!amountToPay) {
      Alert.alert("Error", "Amount to pay is not calculated");
      return;
    }
    
 
    const payload = {
      provider: selectedProvider,
      quantity: quantity,
      amount: amountToPay.replace("N", ""), // Remove currency symbol
      ref: transRef
    };
    
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No access token found");
        setLoading(false);
        return;
      }
      const response = await fetch("https://insighthub.com.ng/api/exam/index.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const resJson = await response.json();
      console.log("Exam Pin  Response:", resJson);
      if (resJson.status === "success") {
        Alert.alert("Success", "Exam Pin purchase successful");
        const combinedData = { providerName:providerName,Token:resJson.msg, quantity:quantity, amount: amountToPay,ref: transRef,date: new Date().toDateString() };
  
        router.replace({
          pathname: "Dashboard/receipts/ExamReceipts",
          params: { transaction: JSON.stringify(combinedData) }
        });     
  
      } else {
        Alert.alert("Error", resJson.msg || "Exam Pin purchase failed");
      }
    } catch (error) {
      console.error("Error purchasing exam pin:", error);
      Alert.alert("Error", "An error occurred while processing your request");
    } finally {
      setLoading(false);
    }
  };


  

  // This function is called when re-authentication succeeds.
  const onReauthSuccess = () => {
    setReauthVisible(false);
    // Now proceed with the purchase action.
    handlePurchase();
    
  };

  // When user taps Buy Data, instead of directly calling handleBuyData, show modal.
 
  const onBuyPress = () => {

    setReauthVisible(true);

  };

  return (
    <ScrollView style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.header, { color: theme === "dark" ? "#fff" : "#000" }]}>Purchase Exam Pin</Text>
      
      {/* Exam Provider Picker */}
      <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Select Exam Provider</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedProvider}
          onValueChange={(itemValue) => setSelectedProvider(itemValue)}
          style={[styles.picker, { color: theme === "dark" ? "#fff" : "#000" }]}
        >
          <Picker.Item label="Select Provider" value="" />
          {examProviders.map(provider => (
            <Picker.Item 
              key={provider.eId} 
              label={provider.provider} 
              value={provider.eId}
              // Optionally, include providerprice as needed
            />
          ))}
        </Picker>
      </View>
      
      {/* Quantity Input */}
      <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Quantity</Text>
      <TextInput
        style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
        placeholder="Enter Quantity"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />
      
      {/* Amount To Pay Display */}
      <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Amount To Pay</Text>
      <TextInput
        style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
        value={amountToPay}
        editable={false}
      />
      
      <TouchableOpacity style={styles.button} onPress={onBuyPress} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Purchase Pin</Text>
        )}
      </TouchableOpacity>
      <ReAuthModalWrapper
        visible={reauthVisible}
        onSuccess={onReauthSuccess} // this calls the purchase function
        onCancel={() => setReauthVisible(false)}
        combinedData={null} // pass the combinedData to the modal
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#7734eb" },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#333" },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 15 },
  picker: { height: 50, width: "100%" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: "#7734eb", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});

export default BuyExamPin;
