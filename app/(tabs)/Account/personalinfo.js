import { View, Text, StatusBar, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { signOut } from '../../../store'
import { Icon } from '@rneui/themed'


const personalinfo = () => {


      const [profile, setProfile] = useState(null);

      const router = useRouter(); 

        const handleLogout = async () => {
          signOut();
          router.replace("/login");
        };

      useEffect(() => {
        const loadAndFetchProfile = async () => {
          try {
            const rawApiResponse = await AsyncStorage.getItem("rawApiResponse");
            if (rawApiResponse) {
              const parsedResponse = JSON.parse(rawApiResponse);
              setProfile(parsedResponse);
              
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
      
    

      if (!profile) {
        return (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Error loading profile.</Text>
            <TouchableOpacity onPress={handleLogout}>
              <Icon name="log-out-outline" type="ionicon" color="red" size={24} />
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        );
      }

  return (
    <View style={{flex:1,backgroundColor:'#fff',paddingTop:getStatusBarHeight(),}}>
      <StatusBar
              translucent
              barStyle="dark-content"
              backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
            />
<View style={{flexDirection:'row',alignItems:'center',marginTop:5}}>

    <TouchableOpacity onPress={() => router.back()}>
             <Ionicons name="arrow-back" size={24} color="black" style={{marginLeft:8}} />
    </TouchableOpacity>

<Text style={{alignSelf:'center',fontSize:20,marginLeft:5}}>Profile Details</Text>
</View>
     
     <View style={{marginTop:40}}>
      <Text style={styles.header}>First Name</Text>
        <TextInput 
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5,
             marginTop: 3 ,width:'94%',alignSelf:'center',height:50}}
        placeholder="Enter Full Name"
        keyboardType="ascii-capable"
        value={profile.sFname}
        editable={false}  // This disables the TextInput
        />


<Text style={styles.header}>Last Name</Text>
<TextInput 
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5,
             marginTop: 5 ,width:'94%',alignSelf:'center',marginTop:10,height:50}}
        placeholder="Enter phone"
        keyboardType="ascii-capable"
        value={profile.sLname}
        editable={false}  // This disables the TextInput
        />

<Text style={styles.header}>Email</Text>
<TextInput  
  style={{
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: '94%',
    alignSelf: 'center',
    marginTop: 10,
    height: 50,
  }}
  placeholder="Enter Address"
  keyboardType="ascii-capable"
  value={profile.sState}
  editable={false}  // This disables the TextInput
/>


<Text style={styles.header}>Phone</Text>
<TextInput  
  style={{
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: '94%',
    alignSelf: 'center',
    marginTop: 10,
    height: 50,
  }}
  placeholder="Enter Address"
  keyboardType="ascii-capable"
  value={profile.sPhone}
  editable={false}  // This disables the TextInput
/>

<Text style={styles.header}>Email</Text>
<TextInput  
  style={{
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: '94%',
    alignSelf: 'center',
    marginTop: 10,
    height: 50,
  }}
  placeholder="Enter Address"
  keyboardType="ascii-capable"
  value={profile.sEmail}
  editable={false}  // This disables the TextInput
/>
     </View>

    

    </View>
  )
}

export default personalinfo
const styles = StyleSheet.create({
header:{fontSize: 16, marginTop: 5, marginBottom: 0, fontWeight: "bold", color: "#333",marginLeft:12}

})
