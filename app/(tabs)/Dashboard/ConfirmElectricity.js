// ConfirmElectricity.js

import React, { useContext, useState } from 'react';
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
import { useRouter, useLocalSearchParams } from 'expo-router';
import ReAuthModalWrapper from '../../../components/ReAuthModalWrapper';
import { ThemeContext } from "../../../ThemeContext"; 

const ConfirmElectricity = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [reauthVisible, setReauthVisible] = useState(false);
 const { theme, toggleTheme } = useContext(ThemeContext);
  // Log route parameters for debugging
  console.log("Route parameters:", params);

  // Expecting verificationData to be passed as a JSON string
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
    metertype,        // Meter type (prepaid/postpaid)
    phone,            // Customer phone number
    meternumber,      // Meter number
    amount,           // Entered amount
    amounttopay       // Calculated total (entered amount + electricity charge)
  } = data;

  // Additionally, retrieve the Customer Name from the verification response.
  // (It might be under "Customer_Name" or "name".)
  const customerName = data.Customer_Name || data.name || "N/A";
  const electricityDetails = data.electricitydetails || "Electricity Bill";

  const [loading, setLoading] = useState(false);

  // Function to handle the final purchase request
  const handlePurchase = async () => {
    const transRef = "ELEC" + Date.now();
    // Build the payload that the purchase API endpoint expects.
    const payload = {
      provider: provider,           // Provider id (as passed earlier)
      metertype: metertype,         // Meter type
      phone: phone,                 // Customer phone number
      meternumber: meternumber,     // Meter number
      amount: amount,               // Amount entered
      amounttopay: amounttopay,     // Total to pay
      ref: transRef                // New transaction reference
    };

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No access token found");
        setLoading(false);
        return;
      }
      const response = await fetch("https://insighthub.com.ng/api/electricity/index.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const resJson = await response.json();
      console.log("Purchase Electricity Response:", resJson);
      if (resJson.status === "success") {
        Alert.alert("Success", "Purchase successful. ");
       
        const combinedData = {...JSON.parse(verificationData),response:resJson, date: new Date().toDateString()};
   
        router.replace({
          pathname: "Dashboard/receipts/ElectricityReceipt",
          params: { transaction: JSON.stringify(combinedData) }
        });

        
      } else {
        Alert.alert("Error", resJson.msg || "Purchase failed.");
      }
    } catch (error) {
      console.error("Error purchasing electricity:", error);
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
 
  const onBuyPowerPress = () => {

    setReauthVisible(true);

  };

  return (
    <ScrollView style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <Text style={[styles.header, { color: theme === "dark" ? "#fff" : "#000" }]}>Confirm Electricity Purchase</Text>
      
      <View style={styles.detailRow}>
         <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Provider:</Text>
            <Text style={[styles.value, { color: theme === "dark" ? "#fff" : "#000" }]}>{data.providerName || data.provider || "N/A"}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Meter Type:</Text>
        <Text style={[styles.value, { color: theme === "dark" ? "#fff" : "#000" }]}>{metertype || "N/A"}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Customer Name:</Text>
        <Text style={[styles.value, { color: theme === "dark" ? "#fff" : "#000" }]}>{customerName}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Phone Number:</Text>
        <Text style={[styles.value, { color: theme === "dark" ? "#fff" : "#000" }]}>{phone || "N/A"}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Meter Number:</Text>
        <Text style={[styles.value, { color: theme === "dark" ? "#fff" : "#000" }]}>{meternumber || "N/A"}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Amount:</Text>
        <Text style={[styles.value, { color: theme === "dark" ? "#fff" : "#000" }]}>N{amount || "N/A"}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Amount To Pay:</Text>
        <Text style={[styles.value, { color: theme === "dark" ? "#fff" : "#000" }]}>{amounttopay || "N/A"}</Text>
      </View>
      
      <Text style={styles.note}>
        Please confirm that the above details are correct before clicking "Purchase Unit".
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={onBuyPowerPress} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Purchase Unit</Text>
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
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20, color: "#7734eb" },
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  detailRow: { flexDirection: "row", marginBottom: 10 },
  label: { fontWeight: "bold", width: 150, color: "#333" },
  value: { flex: 1, color: "#555" },
  note: { fontSize: 14, color: "#555", marginVertical: 15 },
  button: { backgroundColor: "#7734eb", padding: 15, borderRadius: 8, alignItems: "center", marginBottom: 20 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});

export default ConfirmElectricity;
