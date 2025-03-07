// BuyCable.js

import React, { useContext,useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ThemeContext } from "../../../ThemeContext"; 
import { Ionicons } from "@expo/vector-icons";
import { getStatusBarHeight } from "react-native-status-bar-height";

// Helper function to generate a transaction reference
const generateTransRef = () => "CABLE" + Date.now();

const BuyCable = () => {
  const router = useRouter();
    const { theme, toggleTheme } = useContext(ThemeContext);
  
  // State variables
  const [cableProviders, setCableProviders] = useState([]);
  const [cablePlans, setCablePlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [subscriptionType, setSubscriptionType] = useState("");
  const [phone, setPhone] = useState("");
  const [iucNumber, setIucNumber] = useState("");
  const [amountToPay, setAmountToPay] = useState("");
  const [cableDetails, setCableDetails] = useState(""); // For plan description
  const [loading, setLoading] = useState(false);
  
  // --- Fetch cable providers and plans from API ---
  useEffect(() => {
    const fetchCableData = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "No access token found");
          return;
        }
        const response = await fetch("https://insighthub.com.ng/api/cabletv/getcable.php", {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Token ${token}`
          }
        });
        const json = await response.json();
        console.log("Cable API response:", json);
        if (json.status === "success") {
          setCableProviders(json.cableProviders || []);
          setCablePlans(json.cablePlans || []);
        } else {
          Alert.alert("Error", json.msg || "Failed to load cable data");
        }
      } catch (error) {
        console.error("Error fetching cable data:", error);
        Alert.alert("Error", "An error occurred while fetching cable data");
      }
    };
    fetchCableData();
  }, []);
  
  // --- When a provider is selected, filter the cable plans ---
  useEffect(() => {
    if (!selectedProvider) {
      setFilteredPlans([]);
      setSelectedPlan("");
      setAmountToPay("");
      setCableDetails("");
      return;
    }
    // Filter plans where the plan's cableprovider equals the selected provider id.
    const filtered = cablePlans.filter(plan => plan.cableprovider == selectedProvider);
    setFilteredPlans(filtered);
    // Reset selected plan and price details
    setSelectedPlan("");
    setAmountToPay("");
    setCableDetails("");
  }, [selectedProvider, cablePlans]);
  
  // --- When a plan is selected, update Amount To Pay and Cable Details ---
  const handlePlanChange = (planId) => {
    setSelectedPlan(planId);
    const plan = filteredPlans.find(p => p.cpId == planId);
    if (plan) {
      // Update the price (assumes plan.price holds the price)
      setAmountToPay("N" + plan.price);
      // Update cable details (for example, plan name with day info)
      setCableDetails(`${plan.name} (${plan.day} Days)`);
    } else {
      setAmountToPay("");
      setCableDetails("");
    }
  };

  // --- Form validation and POST request for cable TV verification ---
  const handleNext = async () => {
    // Validate required fields
    if (!selectedProvider) {
      Alert.alert("Error", "Please select a cable provider");
      return;
    }
    if (!selectedPlan) {
      Alert.alert("Error", "Please select a cable plan");
      return;
    }
    if (!subscriptionType) {
      Alert.alert("Error", "Please select a subscription type");
      return;
    }
    if (!phone) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }
    if (!iucNumber) {
      Alert.alert("Error", "Please enter the IUC number");
      return;
    }
    if (!amountToPay) {
      Alert.alert("Error", "Amount to pay is not calculated");
      return;
    }
    
    const transRef = generateTransRef();
    const payload = {
      provider: selectedProvider,
      cableplan: selectedPlan,
      subtype: subscriptionType,
      phone: phone,
      iucnumber: iucNumber,
      amounttopay: amountToPay,
      ref: transRef,
      cabledetails: cableDetails,
      providerName: cableProviders.find(p => p.cId == selectedProvider)?.provider || "N/A"
    };
    
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No access token found");
        setLoading(false);
        return;
      }
      const response = await fetch("https://insighthub.com.ng/api/cabletv/verify/index.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const resJson = await response.json();
      console.log("Cable Verification Response:", resJson);
      if (resJson.status === "success") {
        const combinedData = { ...payload, Customer_Name: resJson.Customer_Name };
        router.push({
          pathname: "Dashboard/ConfirmPayCable",
          params: { verificationData: JSON.stringify(combinedData) }
        });
      } else {
        Alert.alert("Error", resJson.msg || "Verification failed");
      }
    } catch (error) {
      console.error("Error verifying cable data:", error);
      Alert.alert("Error", "An error occurred while verifying cable details");
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
         
            <Text style={[styles.header, { color: theme === "dark" ? "#fff" : "#000" }]}>Cable Subscription</Text>    
 </View>


      {/* Cable Provider Picker */}
      <Text style={[styles.labelText, { color: theme === "dark" ? "#fff" : "#000" }]}>Select Cable Provider</Text>
      <View style={[styles.pickerContainer, { color: theme === "dark" ? "#fff" : "#000" }]}>
        <Picker
          selectedValue={selectedProvider}
          onValueChange={(itemValue) => setSelectedProvider(itemValue)}
          style={[styles.picker, { color: theme === "dark" ? "#fff" : "#000" }]}
        >
          <Picker.Item label="Select Provider" value="" />
          {cableProviders.map((provider) => (
            <Picker.Item
              key={provider.cId}
              label={provider.provider}
              value={provider.cId}
            />
          ))}
        </Picker>
      </View>
      
      {/* Cable Plan Picker */}
      <Text style={[styles.labelText, { color: theme === "dark" ? "#fff" : "#000" }]}>Select Cable Plan</Text>
      <View style={[styles.pickerContainer, { color: theme === "dark" ? "#fff" : "#000" }]}>
        <Picker
          selectedValue={selectedPlan}
          onValueChange={(itemValue) => handlePlanChange(itemValue)}
          style={[styles.picker, { color: theme === "dark" ? "#fff" : "#000" }]}
        >
          {filteredPlans.length === 0 ? (
            <Picker.Item label="No plans available" value="" />
          ) : (
            filteredPlans.map((plan) => (
              <Picker.Item
                key={plan.cpId}
                label={`${plan.name} (N${plan.price}) (${plan.day} Days)`}
                value={plan.cpId}
              />
            ))
          )}
        </Picker>
      </View>
      
      {/* Subscription Type Picker */}
      <Text style={[styles.labelText, { color: theme === "dark" ? "#fff" : "#000" }]}>Subscription Type</Text>
      <View style={[styles.pickerContainer, { color: theme === "dark" ? "#fff" : "#000" }]}>
        <Picker
          selectedValue={subscriptionType}
          onValueChange={(itemValue) => setSubscriptionType(itemValue)}
          style={[styles.picker, { color: theme === "dark" ? "#fff" : "#000" }]}
        >
          <Picker.Item label="Select Type" value="" />
          <Picker.Item label="Change" value="change" />
          <Picker.Item label="Renew" value="renew" />
        </Picker>
      </View>
      
      {/* Customer Phone Number */}
      <Text style={[styles.labelText, { color: theme === "dark" ? "#fff" : "#000" }]}>Customer Phone Number</Text>
      <TextInput
        style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      
      {/* IUC Number */}
      <Text style={[styles.labelText, { color: theme === "dark" ? "#fff" : "#000" }]}>IUC Number</Text>
      <TextInput
        style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
        placeholder="Enter IUC number"
        keyboardType="numeric"
        value={iucNumber}
        onChangeText={setIucNumber}
      />
      
      {/* Amount To Pay */}
      <Text style={[styles.labelText, { color: theme === "dark" ? "#fff" : "#000" }]}>Amount To Pay</Text>
      <TextInput
        style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
        value={amountToPay}
        editable={false}
      />
      
      {/* Hidden field: Cable Details (can be shown if needed) */}
      <Text style={[styles.labelText, { color: theme === "dark" ? "#fff" : "#000" }]}>Plan Details</Text>
      <TextInput
        style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
        value={cableDetails}
        editable={false}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleNext} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Next</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 ,paddingTop:getStatusBarHeight()},
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginLeft: 10, color: "#7734eb" },
  labelText: { fontSize: 16, fontWeight: "bold", marginBottom: 5, color: "#333" },
  pickerContainer: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, marginBottom: 15 },
  picker: { height: 50, width: "100%" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
  button: { backgroundColor: "#7734eb", padding: 15, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});

export default BuyCable;
