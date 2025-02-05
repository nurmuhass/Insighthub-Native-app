import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StatusBar } from "react-native";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

const AirtimeSwap = () => {
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [walletBalance, setWalletBalance] = useState(1197.8);
    const [selectedAmount, setSelectedAmount] = useState("");
    const router = useRouter();
  const networks = [
    { id: "mtn", name: "MTN", logo: require("../../../images/mtn.png") },
    { id: "glo", name: "Glo", logo: require("../../../images/glo.jpeg") },
    { id: "airtel", name: "Airtel", logo: require("../../../images/airtel.jpeg") },
    { id: "9mobile", name: "9mobile", logo: require("../../../images/9mobile.png") },
  ];

  const handleBuyData = () => {
    if (!selectedNetwork || !phoneNumber) {
      Alert.alert("Error", "Please select a network and enter a phone number.");
      return;
    }
    Alert.alert("Success", `Data purchase successful for ${phoneNumber} on ${selectedNetwork.name}.`);
  };

  return (
       <View style={{paddingTop:getStatusBarHeight(),backgroundColor:'#fff',flex:1,}}>
           <StatusBar
     translucent
     barStyle="dark-content"
     backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
   />

<View style={{    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',}}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.back()} style={{   }}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
         
          </View>

          <Text style={{   fontSize: 20,
    fontWeight: 'bold'}}>Airtime Swap</Text>

          {/* Share Button */}
          <TouchableOpacity onPress={{}} style={{    padding: 7,
    backgroundColor: '#2899ff',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 35,}}>
            <Text style={{ color: '#fff'}}>Next</Text>
          </TouchableOpacity>
        </View>


      {/* Wallet Balance */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: "#f1f1f1", borderRadius: 5, marginBottom: 20,width:'96%',alignItems:'center' ,alignSelf:'center',marginVertical:8}}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
        <AntDesign name="wallet" size={24} color="black" />
        <Text style={{ fontWeight: "bold" ,marginLeft:5}}>Wallet Balance</Text>
        </View>
        <Text style={{ color: "green", fontWeight: "bold" }}>N{walletBalance.toFixed(2)}</Text>
      </View>
<View style={{marginHorizontal:10}}>


      {/* Select Network */}
      <Text style={{ marginBottom: 10 }}>Select Network</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {networks.map((network) => (
          <TouchableOpacity key={network.id} onPress={() => setSelectedNetwork(network)}>
            <Image source={network.logo} resizeMode="contain" style={{ width: 50, height: 50, opacity: selectedNetwork?.id === network.id ? 1 : 0.5 }} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Phone Number Input */}


      <Text style={{ marginTop: 20 }}>Phone Number</Text>
      <View style={{  alignItems: "center" }}>
      <TextInput
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginTop: 5 ,width:'100%'}}
        placeholder="Enter Phone Number"
        keyboardType="numeric"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <MaterialIcons name="contacts" size={24} color="black"  style={{position:'absolute',top:10,right:5}}/>
      </View>
  

     {/* Custom Amount Input */}
        <TextInput
          style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5, marginTop: 10, }}
          placeholder="Enter Amount"
          keyboardType="numeric"
          value={selectedAmount}
          onChangeText={setSelectedAmount}
        />

      {/* Buy Now Button */}
      {/* <TouchableOpacity
        style={{ backgroundColor: selectedNetwork && phoneNumber ? "#d9534f" : "#ccc", padding: 15, borderRadius: 5, marginTop: 20 }}
        onPress={handleBuyData}
        disabled={!selectedNetwork || !phoneNumber}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Buy Now</Text>
      </TouchableOpacity> */}
      </View>

    </View>
  );
};

export default AirtimeSwap;
