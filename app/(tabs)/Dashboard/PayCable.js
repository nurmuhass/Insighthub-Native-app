import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { useRouter } from "expo-router";

const CableSubscription = () => {
  const [selectedProvider, setSelectedProvider] = useState("dstv");
  const [iucNumber, setIucNumber] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const walletBalance = 1401.8;
    const router = useRouter();
  const providers = [
    { id: "dstv", name: "DSTV", image: require("../../../images/dstv.jpeg") },
    { id: "gotv", name: "GOTV", image: require("../../../images/gotv.png") },
    { id: "startimes", name: "Startimes", image: require("../../../images/startimes.jpeg") },
  ];

  const plans = {
    dstv: [
      { name: "DStv Padi", price: 3600 },
      { name: "DStv Yanga", price: 5100 },
      { name: "DStv Confam", price: 7500 },
      { name: "DStv Asia", price: 12400 },
      { name: "DStv Compact", price: 15700 },
      { name: "DStv Compact Plus", price: 25000 },
      { name: "DStv Premium", price: 42000 },
    ],
    gotv: [
      { name: "GOtv Smallie", price: 1200 },
      { name: "GOtv Jinja", price: 2700 },
      { name: "GOtv Jolli", price: 3700 },
      { name: "GOtv Max", price: 4900 },
      { name: "GOtv Supa", price: 6400 },
    ],
    startimes: [
      { name: "Startimes Nova", price: 1200 },
      { name: "Startimes Basic", price: 2500 },
      { name: "Startimes Smart", price: 3400 },
      { name: "Startimes Classic", price: 4500 },
      { name: "Startimes Super", price: 6500 },
    ],
  };

  return (
    <View style={{ paddingTop: getStatusBarHeight(), backgroundColor: "#fff", flex: 1, padding: 20 }}>
      <StatusBar translucent barStyle="dark-content" backgroundColor="rgba(255, 255, 255, 0)" />

      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10 }}>Cable Sub</Text>
      </View>

      {/* Wallet Balance */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: "#f1f1f1", borderRadius: 5 }}>
        <Text>Wallet Balance</Text>
        <Text style={{ color: "green", fontWeight: "bold" }}>N{walletBalance.toFixed(2)}</Text>
      </View>

      {/* Select Cable Provider */}
      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Select Cable</Text>
      <View style={{ flexDirection: "row", marginVertical: 10,justifyContent:'space-between' }}>
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

      {/* IUC Number */}
      <Text style={{ fontWeight: "bold" }}>IUC Number</Text>
      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginTop: 5 }}
        placeholder="Enter IUC Number"
        keyboardType="numeric"
        value={iucNumber}
        onChangeText={setIucNumber}
      />

      {/* Choose Subscription Plan */}
      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Choose a Plan</Text>
      <FlatList
        data={plans[selectedProvider]}
        numColumns={2}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedPlan(item.name)}
            style={{ flex: 1, padding: 15, margin: 5, backgroundColor: selectedPlan === item.name ? "#7734eb" : "#f1f1f1", borderRadius: 5 }}
          >
            <Text style={{ color: selectedPlan === item.name ? "white" : "black", textAlign: "center" }}>{item.name}</Text>
            <Text style={{ color: selectedPlan === item.name ? "white" : "black", textAlign: "center" }}>N{item.price.toLocaleString()}</Text>
          </TouchableOpacity>
        )}
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

export default CableSubscription;
