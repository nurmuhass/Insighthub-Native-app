import { View, Text, StatusBar, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const Manual = () => {

     const router = useRouter();
  const [index, setIndex] = useState(0);
     const accounts = [
        { name: "Palmpay", number: "1290876722", charge: "No Charge" },
        { name: "Palmpay", number: "1290876722", charge: "No Charge" },
       
      ];

      
        // Function to toggle between accounts
        const toggleAccount = () => {
          setIndex((prevIndex) => (prevIndex === 0 ? 1 : 0));
        };
      
        // Function to copy account number to clipboard
        const copyToClipboard = async () => {
          await Clipboard.setStringAsync(accounts[index].number);
          
          // Show a toast message for Android, and an alert for iOS
          if (Platform.OS === "android") {
            ToastAndroid.show("Copied!", ToastAndroid.SHORT);
          } else {
            Alert.alert("Copied!", "Account number copied to clipboard.");
          }
        };
  return (
    <View style={{paddingTop:getStatusBarHeight(),backgroundColor:'#fff',flex:1,   padding: 20,}}>
    <StatusBar
translucent
barStyle="dark-content"
backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
/>
{/* Header */}

<View style={{ flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop:20,}}>
  <TouchableOpacity onPress={() => router.back()}>
    <Ionicons name="arrow-back" size={24} color="#7734eb" />
  </TouchableOpacity>
  <Text style={{    fontSize: 24,
    fontWeight: "bold",
    color: "#7734eb",
    marginLeft: 10,}}>Manual Funding</Text>
</View>

<View style={{borderColor:'#7734eb',borderWidth:1,padding:34,borderRadius:10}}>
      <Text style={{ color: "gray", marginTop: 5, fontWeight: "bold" }}>
        {accounts[index].name}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 3 }}>
        <Text style={{ color: "gray", fontSize: 18, fontWeight: "bold" }}>
          {accounts[index].number}
        </Text>
        <TouchableOpacity onPress={copyToClipboard}>
          <Feather name="copy" size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "gray", fontWeight: "bold" }}>{accounts[index].charge}</Text>
        <TouchableOpacity onPress={toggleAccount}>
          <Ionicons name="chevron-forward" size={24} color="#111" />
        </TouchableOpacity>
      </View>
    </View>

    </View>
  )
}

export default Manual