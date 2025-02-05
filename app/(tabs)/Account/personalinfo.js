import { View, Text, StatusBar, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const personalinfo = () => {

    const [fullname, setFullname] = useState("Nur Muhass Hassan");
    const [phone, setPhone] = useState("08067546787");
    const [address, setAddress] = useState("Gwarinpa Abuja");
      const router = useRouter(); 
  return (
    <View style={{flex:1,backgroundColor:'#fff',paddingTop:getStatusBarHeight(),}}>
      <StatusBar
              translucent
              barStyle="dark-content"
              backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
            />
<View style={{flexDirection:'row',alignItems:'center',marginTop:10}}>

    <TouchableOpacity onPress={() => router.back()}>
             <Ionicons name="arrow-back" size={24} color="black" style={{marginLeft:8}} />
    </TouchableOpacity>

<Text style={{marginLeft:'30%',fontSize:24}}>Edit User</Text>
</View>
     
     <View style={{marginTop:40}}>
        <TextInput 
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5,
             marginTop: 5 ,width:'94%',alignSelf:'center',height:50}}
        placeholder="Enter Full Name"
        keyboardType="ascii-capable"
        value={fullname}
        onChangeText={setFullname}
        />

<TextInput 
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5,
             marginTop: 5 ,width:'94%',alignSelf:'center',marginTop:20,height:50}}
        placeholder="Enter phone"
        keyboardType="ascii-capable"
        value={phone}
        onChangeText={setPhone}
        />

<TextInput 
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5,
             marginTop: 5 ,width:'94%',alignSelf:'center',marginTop:20,height:50}}
        placeholder="Enter Address"
        keyboardType="ascii-capable"
        value={address}
        onChangeText={setAddress}
        />
     </View>

      <TouchableOpacity onPress={{}} style={{ padding: 15, backgroundColor: "#7734eb", borderRadius: 5, marginTop: 20 ,width:'96%',alignSelf:'center'}}>
        <Text style={{ color: "white", textAlign: "center" }}>Submit</Text>
      </TouchableOpacity>

    </View>
  )
}

export default personalinfo