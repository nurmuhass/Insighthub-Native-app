


// i want you to use this ui instead of the above // Electricity.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, FlatList, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";

const Electricity = () => {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [meterNumber, setMeterNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [meterType, setMeterType] = useState("prepaid");
  const [selectedAmount, setSelectedAmount] = useState("");
  const walletBalance = 426.8;
 const router = useRouter();
//  dummy datas
  const discoProviders = [
    "Abuja DISCO", "Benin DISCO", "Eko DISCO", "Enugu DISCO", "Ibadan DISCO",
    "Ikeja DISCO", "Jos DISCO", "Kaduna DISCO", "Kano DISCO", "Port Harcourt DISCO",
    "Yola DISCO"
  ];
const electricitycharge = 60
  const amounts = [500, 1000, 2000, 3000, 5000, 10000];

  const handleAmountSelection = (amount) => {
    setSelectedAmount(amount.toString());
  };

  const handleNext = () => {
    if (!selectedProvider || !meterNumber || !selectedAmount) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    Alert.alert("Success", `Payment of N${selectedAmount} to ${selectedProvider} successful.`);
  };

  return ( 
       <ScrollView style={{ paddingTop: getStatusBarHeight(), backgroundColor: '#fff', flex: 1, padding: 10 }}>

      <StatusBar translucent barStyle="dark-content" backgroundColor="rgba(255, 255, 255, 0)" />
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
         <TouchableOpacity onPress={() => router.back()} style={{   }}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>Electricity</Text>
      </View>

      {/* Wallet Balance */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: "#f1f1f1", borderRadius: 5 }}>
        <Text>Wallet Balance</Text>
        <Text style={{ color: "red", fontWeight: "bold" }}>N{walletBalance.toFixed(2)}</Text>
      </View>

      {/* Select Provider */}
      <Text style={{ marginTop: 20 }}>Select Disco Provider</Text>
      <Picker selectedValue={selectedProvider} onValueChange={setSelectedProvider}>
        <Picker.Item label="Select Disco Provider" value={null} />
        {discoProviders.map((provider) => (
          <Picker.Item key={provider} label={provider} value={provider} />
        ))}
      </Picker>

      {/* Meter Number */}
      <Text style={{ marginTop: 10 }}>Meter Number</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5 }}
        placeholder="Enter Meter Number"
        keyboardType="numeric"
        value={meterNumber}
        onChangeText={setMeterNumber}
      />

            {/* Phone Number */}
            <Text style={{ marginTop: 10 }}>Phone Number</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5 }}
        placeholder="Enter your Phone Number"
        keyboardType="numeric"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {/* Meter Type */}
      <Text style={{ marginTop: 20 }}>Select Meter Type</Text>
      <View style={{ flexDirection: "row", marginBottom: 20 }}>
        <TouchableOpacity onPress={() => setMeterType("prepaid")} style={{ padding: 10, backgroundColor: meterType === "prepaid" ? "#7734eb" : "#ccc", borderRadius: 5, marginRight: 10 }}>
          <Text style={{ color: "white" }}>Prepaid</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setMeterType("postpaid")} style={{ padding: 10, backgroundColor: meterType === "postpaid" ? "#7734eb" : "#ccc", borderRadius: 5 }}>
          <Text style={{ color: "white" }}>Postpaid</Text>
        </TouchableOpacity>
      </View>

      {/* Amount Selection */}
      <Text>Choose an amount</Text>
      <FlatList
        data={amounts}
        horizontal
        contentContainerStyle={{marginBottom:5}}
        keyExtractor={(item) => item.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleAmountSelection(item)} style={{ padding: 10, backgroundColor: selectedAmount == item ? "#7734eb" : "#ccc", borderRadius: 5, margin: 5, }}>
            <Text style={{ color: "white" }}>N{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Custom Amount Input */}
      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginTop: 10, }}
        placeholder="Enter Amount"
        keyboardType="numeric"
        value={selectedAmount}
        onChangeText={setSelectedAmount}
      />

            {/* Custom Amount to pay Input */}
            <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginTop: 10, }}
        placeholder="Amount to pay"
        keyboardType="numeric"
      />
<View>
  <Text style={{color:'red',alignSelf:'center'}} >Transaction Attract a service charge of <Text>{electricitycharge}</Text> only </Text>
</View>

      {/* Next Button */}
      <TouchableOpacity onPress={handleNext} style={{ padding: 15, backgroundColor: "#7734eb", borderRadius: 5, marginTop: 20 }}>
        <Text style={{ color: "white", textAlign: "center" }}>Next</Text>
      </TouchableOpacity>
      </ScrollView>
  );
};

export default Electricity;
