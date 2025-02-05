import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useRouter } from "expo-router";

const EduPin = () => {
  const [selectedProvider, setSelectedProvider] = useState("WAEC");
  const [Quantity, setQuantity] = useState("");
  const walletBalance = 1401.8;
    const router = useRouter();
  const providers = [
    { id: "WAEC", name: "WAEC", image: require("../../../images/waec.jpeg") },
    { id: "NECO", name: "NECO", image: require("../../../images/neco.jpeg") },
  ];

  return (
    <View style={{ paddingTop: getStatusBarHeight(), backgroundColor: "#fff", flex: 1, padding: 20 }}>
      <StatusBar translucent barStyle="dark-content" backgroundColor="rgba(255, 255, 255, 0)" />

      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>Education Pin</Text>
      </View>

      {/* Wallet Balance */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: "#f1f1f1", borderRadius: 5 }}>
        <Text>Wallet Balance</Text>
        <Text style={{ color: "green", fontWeight: "bold" }}>N{walletBalance.toFixed(2)}</Text>
      </View>

      {/* Select Cable Provider */}
      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Education Pin</Text>
      <View style={{ flexDirection: "row", marginVertical: 10,justifyContent:'space-evenly' }}>
        {providers.map((provider) => (
          <TouchableOpacity
            key={provider.id}
            onPress={() => setSelectedProvider(provider.id)}
            style={{ marginRight: 10, borderWidth: selectedProvider === provider.id ? 2 : 0, borderColor: "red", borderRadius: 5 }}
          >
            <Image source={provider.image} style={{ width: 60, height: 50 }} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Quantity*/}
      <Text style={{ fontWeight: "bold" }}>Quantity</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginTop: 5 }}
        placeholder="Quantity"
        keyboardType="numeric"
        value={Quantity}
        onChangeText={setQuantity}
      />

     
      {/* Next Button */}
      <TouchableOpacity
        style={{ padding: 15, backgroundColor: "#7734eb", borderRadius: 5, marginTop: 20 }}
        onPress={() => alert(`Proceeding with ${selectedPlan}`)}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EduPin;
