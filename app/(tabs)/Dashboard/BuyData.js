import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Switch, ActivityIndicator, ScrollView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper function to generate a transaction reference
const generateTransRef = () => "TRANS" + Date.now();

// Helper function to get stored cookie from AsyncStorage
const getCookieHeader = async () => {
  const cookie = await AsyncStorage.getItem("cookie");
  return cookie || "";
};

const BuyDataScreen = () => {
  const router = useRouter();
  
  const [networks, setNetworks] = useState([]);
  const [dataPlans, setDataPlans] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState("");
  const [selectedDataType, setSelectedDataType] = useState("SME");
  const [filteredDataPlans, setFilteredDataPlans] = useState([]);
  const [selectedDataPlan, setSelectedDataPlan] = useState("");
  const [phone, setPhone] = useState("");
  const [amountToPay, setAmountToPay] = useState("");
  const [disableValidator, setDisableValidator] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const cookieHeader = await getCookieHeader();
            const response = await fetch("https://insighthub.com.ng/mobile/home/includes/route.php?buy-data", {
                method: "GET",
                headers: { Cookie: cookieHeader },
            });

            // Ensure the response is OK
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Parse the JSON response
            const responseData = await response.json();
            console.log("Buy Data API Response:", responseData);

            // Validate the structure of the response
            if (responseData && Array.isArray(responseData.networks) && Array.isArray(responseData.dataPlans)) {
                setNetworks(responseData.networks);
                setDataPlans(responseData.dataPlans);
            } else {
                console.warn("Unexpected API response format", responseData);
                Alert.alert("Error", "Invalid data format received from server.");
            }
        } catch (error) {
            console.error("Error fetching buy data info:", error);
            Alert.alert("Error", "Unable to load data. Please try again later.");
        }
    };

    fetchData();
}, []);
  // Filter data plans based on selected network and type
  useEffect(() => {
    if (selectedNetwork && dataPlans.length > 0) {
      const filtered = dataPlans.filter(
        (plan) =>
          plan.networkId === selectedNetwork &&
          plan.type.toUpperCase() === selectedDataType.toUpperCase()
      );
      setFilteredDataPlans(filtered);
      if (filtered.length > 0) {
        setSelectedDataPlan(filtered[0].planId);
        setAmountToPay(filtered[0].price.toString());
      } else {
        setSelectedDataPlan("");
        setAmountToPay("");
      }
    }
  }, [selectedNetwork, selectedDataType, dataPlans]);

  const handleDataPlanChange = (planId) => {
    setSelectedDataPlan(planId);
    const plan = filteredDataPlans.find((p) => p.planId === planId);
    if (plan) {
      setAmountToPay(plan.price.toString());
    } else {
      setAmountToPay("");
    }
  };

  const handleBuyData = async () => {
    if (!selectedNetwork || !selectedDataType || !selectedDataPlan || !phone || !amountToPay) {
      Alert.alert("Error", "Please complete all fields");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("network", selectedNetwork);
    formData.append("datagroup", selectedDataType);
    formData.append("dataplan", selectedDataPlan);
    formData.append("phone", phone);
    formData.append("amounttopay", amountToPay);
    formData.append("ported_number", disableValidator ? "on" : "off");
    formData.append("transref", generateTransRef());
    formData.append("transkey", "");

    try {
      const cookieHeader = await getCookieHeader();
      const response = await fetch("https://insighthub.com.ng/mobile/home/includes/route.php?purchase-data", {
        method: "POST",
        body: formData,
        headers: { 
          Cookie: cookieHeader,
          // Do not manually set Content-Type for FormData.
        },
      });
      const respText = await response.text();
      console.log("Buy Data response:", respText);
      if (respText == "0") {
        Alert.alert("Success", "Data purchase successful!");
        router.push("/home");
      } else {
        Alert.alert("Error", "Data purchase failed: " + respText);
      }
    } catch (error) {
      console.error("Buy Data error:", error);
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Buy Data</Text>
      
      <Text style={styles.subHeader}>Select Network</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedNetwork}
          onValueChange={(itemValue) => setSelectedNetwork(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Network" value="" />
          {networks.map((network) => (
            <Picker.Item key={network.nId} label={network.network} value={network.nId} />
          ))}
        </Picker>
      </View>
      
      <Text style={styles.subHeader}>Select Data Type</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedDataType}
          onValueChange={(itemValue) => setSelectedDataType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="SME" value="SME" />
          <Picker.Item label="Gifting" value="Gifting" />
          <Picker.Item label="Corporate" value="Corporate" />
        </Picker>
      </View>
      
      <Text style={styles.subHeader}>Select Data Plan</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedDataPlan}
          onValueChange={(itemValue) => handleDataPlanChange(itemValue)}
          style={styles.picker}
        >
          {filteredDataPlans.length === 0 ? (
            <Picker.Item label="No plans available" value="" />
          ) : (
            filteredDataPlans.map((plan) => (
              <Picker.Item key={plan.planId} label={plan.planName} value={plan.planId} />
            ))
          )}
        </Picker>
      </View>
      
      <Text style={styles.subHeader}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      
      <Text style={styles.subHeader}>Amount To Pay</Text>
      <TextInput
        style={styles.input}
        value={amountToPay}
        editable={false}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>Disable Number Validator</Text>
        <Switch
          value={disableValidator}
          onValueChange={setDisableValidator}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleBuyData} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Buy Data</Text>
        )}
      </TouchableOpacity>
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

export default BuyDataScreen;
