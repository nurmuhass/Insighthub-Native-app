// ConfirmCable.js

import React, { useState } from 'react';
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

const ConfirmPayCable = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
    const [reauthVisible, setReauthVisible] = useState(false);

  // Expected parameter: verificationData (a JSON string)
  const { verificationData } = params;
  let data = {};
  try {
    data = verificationData ? JSON.parse(verificationData) : {};
    console.log("Parsed verification data:", data);
  } catch (error) {
    console.error("Error parsing verification data:", error);
  }
  
  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    // Generate a new transaction reference for the purchase.
    const transRef = "CABLEPUR" + Date.now();
    
    // Build the payload for the purchase request.
    // Adjust field names as needed to match your backend.
    const payload = {
      provider: data.provider,           // Cable Provider ID
      cableplan: data.cableplan,         // Cable Plan ID
      iucnumber: data.iucnumber,         // IUC Number
      phone: data.phone,                 // Customer Phone Number
      subtype: data.subtype,             // Subscription Type ("change" or "renew")
      amounttopay: data.amounttopay,     // Amount To Pay (as displayed)
      cabledetails: data.cabledetails,   // Cable plan details (e.g. plan description)
      ref: transRef                      // New Transaction Reference
    };

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
      if (resJson.status === "success") {
        Alert.alert("Success", "Purchase successful. " + (resJson.msg ? "Unit Token: " + resJson.msg : ""));
        // Optionally navigate to a dashboard or success page:
        // router.push('/Dashboard');
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
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Confirm Cable Subscription</Text>
      
      {/* Display the details from the verification response */}
      <View style={styles.detailRow}>
        <Text style={styles.label}>Provider:</Text>
        <Text style={styles.value}>{data.providerName || data.provider || "N/A"}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Plan:</Text>
        <Text style={styles.value}>{data.cabledetails || "N/A"}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Amount To Pay:</Text>
        <Text style={styles.value}>{data.amounttopay || "N/A"}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Subscription Type:</Text>
        <Text style={styles.value}>{data.subtype || "N/A"}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>Phone Number:</Text>
        <Text style={styles.value}>{data.phone || "N/A"}</Text>
      </View>
      
      <View style={styles.detailRow}>
        <Text style={styles.label}>IUC Number:</Text>
        <Text style={styles.value}>{data.iucnumber || "N/A"}</Text>
      </View>
      
      {data.Customer_Name && (
        <View style={styles.detailRow}>
          <Text style={styles.label}>Customer Name:</Text>
          <Text style={styles.value}>{data.Customer_Name}</Text>
        </View>
      )}
      
      <Text style={styles.note}>
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
        <Text style={styles.backButtonText}>Go Back</Text>
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
