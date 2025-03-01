import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Clipboard, 
  Alert, 
  ActivityIndicator, 
  ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const API_URL = "https://insighthub.com.ng/api/user/fundWallet.php";

const FundWallet = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [walletData, setWalletData] = useState(null);
  const [userId, setUserId] = useState("1");

  useEffect(() => {
    const loadAndFetchProfile = async () => {
      try {

        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "No access token found");
          return;
        }

        const rawApiResponse = await AsyncStorage.getItem("rawApiResponse");
        if (rawApiResponse) {
          const parsedResponse = JSON.parse(rawApiResponse);     
          setUserId(parsedResponse.sId);
        
        } else {
          console.log("rawApiResponse not found in storage.");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        Alert.alert("Error", "An error occurred while fetching transactions");
      }
    };
  
    loadAndFetchProfile();
  }, []);

  useEffect(() => {
    const fetchWalletDetails = async () => {
      if (!userId) return; // Ensure userId is set before making the API call
    
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "No access token found");
          return; 
        }  
    
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { 
            Accept: "application/json",
            "Content-Type": "application/json",    
            "Authorization": `Token ${token}`,
          }, 
          body: JSON.stringify({ sId: userId }),  
        });
    
        // ✅ Check response status before parsing
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        // ✅ Parse JSON only once
        const result = await response.json();
        console.log("API result:", result);  
    
        if (result.status === "success") {
          setWalletData(result.wallet_details);
        } else {
          Alert.alert("Error", result.msg || "Failed to load data.");
        }
      } catch (error) {
        console.error("Error fetching wallet details:", error);
        Alert.alert("Error", "An error occurred while fetching wallet details.");
      } finally {
        setLoading(false);
      }
    };
    
  
    fetchWalletDetails();
  }, [userId]); // Re-run when userId is set
  

  const copyToClipboard = (accountNumber) => {
    Clipboard.setString(accountNumber);
    Alert.alert("Copied", "Account number copied to clipboard.");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#7734eb" />
      </TouchableOpacity>
      <Text style={styles.title}>Fund Wallet</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#7734eb" />
      ) : (
        <ScrollView>
        {walletData && walletData.map((bank, index) => (
  <View key={index} style={styles.bankContainer}>
    <Text style={styles.bankName}>Bank Name: {bank.bank_name}</Text>
    <Text style={styles.accountNo}>Account No: {bank.account_no}</Text>
    <Text style={styles.note}>Note: Automated bank transfer attracts additional charges of {bank.charges} only.</Text>
    <TouchableOpacity style={styles.copyButton} onPress={() => copyToClipboard(bank.account_no)}>
      <Text style={styles.copyButtonText}>Copy Account No</Text>
    </TouchableOpacity>
  </View>
))}

        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7734eb",
    textAlign: "center",
    marginBottom: 20,
  },
  bankContainer: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 10,
  },
  bankName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  accountNo: {
    fontSize: 16,
    color: "#333",
  },
  note: {
    fontSize: 14,
    color: "#d9534f",
    marginVertical: 5,
  },
  copyButton: {
    backgroundColor: "#7734eb",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 5,
  },
  copyButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FundWallet;
