// ConfirmCable.js

import React, {useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Depending on your expo-router version, use the appropriate hook:
import { useRouter, useLocalSearchParams } from 'expo-router';
import ReAuthModalWrapper from '../../../components/ReAuthModalWrapper';
import { ThemeContext } from "../../../ThemeContext"; 

const ConfirmPayCable = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
    const [reauthVisible, setReauthVisible] = useState(false);
    const { theme, toggleTheme } = useContext(ThemeContext);
  // Expected parameter: verificationData (a JSON string)
  const { verificationData } = params;
  let data = {};
  try {
    data = verificationData ? JSON.parse(verificationData) : {};
    console.log("Parsed verification data:", data);
  } catch (error) {
    console.error("Error parsing verification data:", error);
  }

  
  // Destructure payload fields that were passed from the previous screen.
  // These are the fields you built in your previous page's payload.
  const {
    provider,         // Provider id
    providerName,
    cableplan,        // Cable plan id
    phone,            // Customer phone number
    Customer_Name, // Customer Name
    iucnumber,
    subtype,         // Subscription Type ("change" or "renew")
    amounttopay,     
    cabledetails // Cable plan details (e.g. plan description)
  } = data;

   
  
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    // Generate a new transaction reference for the purchase.
    const transRef = "CABLEPUR" + Date.now();
    
    // Build the payload for the purchase request.
   
    const payload = {
      provider: provider,           // Cable Provider ID
      cableplan: cableplan,         // Cable Plan ID
      iucnumber: iucnumber,         // IUC Number
      phone: phone,                 // Customer Phone Number
      subtype: subtype,             // Subscription Type ("change" or "renew")
      amount: amounttopay,         // Amount To Pay (as displayed)
      cabledetails: cabledetails,   // Cable plan details (e.g. plan description)
      ref: transRef                      // New Transaction Reference
    };
console.log("Payload for cable purchase:", payload);
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No access token found");
        setLoading(false);
        return;
      }
      
      const response = await fetch("https://insighthub.com.ng/api/cabletv/index.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
      
      const resJson = await response.json();
      console.log("Cable Purchase Response:", resJson);
            
        const combinedData = {...JSON.parse(verificationData),response:resJson, date: new Date().toDateString()};

      if (resJson.status === "success") {
        Alert.alert("Success", "Purchase successful. ");
        
          router.replace({
      pathname: "Dashboard/receipts/CableReceipt",
      params: { transaction: JSON.stringify(combinedData) }
    });
      } else {
        Alert.alert("Error", resJson.msg || "Purchase failed.");
      }
    } catch (error) {
      console.error("Error purchasing cable:", error);
      Alert.alert("Error", "An error occurred while processing your request.");
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
 
  const onBuyCablePress = () => {


    setReauthVisible(true);

  };

  return (
    <ScrollView style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.header, { color: theme === "dark" ? "#fff" : "#000" }]}>Confirm Cable Subscription</Text>
      
      {/* Display the details from the verification response */}
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Provider:</Text>
        <Text style={[styles.value, { color: theme === "dark" ? "#fff" : "#000" }]}>{data.providerName || data.provider || "N/A"}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Plan:</Text>
        <Text style={[styles.value, { color: theme === "dark" ? "#fff" : "#000" }]}>{data.cabledetails || "N/A"}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Amount To Pay:</Text>
        <Text style={[styles.value, { color: theme === "dark" ? "#fff" : "#000" }]}>{data.amounttopay || "N/A"}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Subscription Type:</Text>
        <Text style={[styles.value, { color: theme === "dark" ? "#fff" : "#000" }]}>{data.subtype || "N/A"}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Phone Number:</Text>
        <Text style={[styles.value, { color: theme === "dark" ? "#fff" : "#000" }]}>{data.phone || "N/A"}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>IUC Number:</Text>
        <Text style={[styles.value, { color: theme === "dark" ? "#fff" : "#000" }]}>{data.iucnumber || "N/A"}</Text>
      </View>
      
      {data.Customer_Name && (
        <View style={styles.detailRow}>
          <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Customer Name:</Text>
          <Text style={[styles.value, { color: theme === "dark" ? "#fff" : "#000" }]}>{data.Customer_Name}</Text>
        </View>
      )}
      
      <Text style={[styles.note, { color: theme === "dark" ? "#fff" : "#000" }]}>
        Please confirm that the above details are correct before you click on "Purchase Plan".
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={onBuyCablePress} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Purchase Plan</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={[styles.backButtonText, { color: theme === "dark" ? "#fff" : "#000" }]}>Go Back</Text>
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
  detailRow: { flexDirection: "row", marginBottom: 10 },
  label: { fontWeight: "bold", width: 150, color: "#333" },
  value: { flex: 1, color: "#555" },
  note: { fontSize: 14, color: "#555", marginVertical: 15 },
  button: { backgroundColor: "#7734eb", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  backButton: { backgroundColor: "#ccc", padding: 15, borderRadius: 8, alignItems: "center" },
  backButtonText: { color: "#333", fontSize: 16, fontWeight: "bold" }
});

export default ConfirmPayCable;
