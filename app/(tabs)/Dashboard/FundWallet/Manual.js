import { View, Text, StatusBar, TouchableOpacity } from 'react-native'
import React, { useContext,useEffect, useState } from 'react'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { Feather, Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Clipboard from "expo-clipboard";
import { Platform, ToastAndroid, Alert } from "react-native";
import { ThemeContext } from "../../../../ThemeContext"; 
import { StyleSheet } from 'react-native'

const Manual = () => {

     const router = useRouter();
         const { theme, toggleTheme } = useContext(ThemeContext);
  const [index, setIndex] = useState(0);
  const [siteSettings, setSiteSettings] = useState([]);
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
          await Clipboard.setStringAsync(siteSettings.accountno);
          
          // Show a toast message for Android, and an alert for iOS
          if (Platform.OS === "android") {
            ToastAndroid.show("Copied!", ToastAndroid.SHORT);
          } else {
            Alert.alert("Copied!", "Account number copied to clipboard.");
          }
        };


        useEffect(() => {
          const getSiteSettings = async () => {
            try {
              const token = await AsyncStorage.getItem("token");
              if (!token) {
                Alert.alert("Error", "No access token found");
                return;
              }
              const response = await fetch("https://insighthub.com.ng/api/user/getsitesettings.php", {
                method: "GET",
                headers: {
                  "Accept": "application/json",
                  "Authorization": `Token ${token}`
                }
              });
              const json = await response.json();
          
              if (json.status === "success") {
                setSiteSettings(json.getSiteSettings || []);
                
              } else {
                Alert.alert("Error", json.msg || "Failed to load SiteSettings");
              }
            } catch (error) {
              console.error("Error fetching SiteSettings:", error);
              Alert.alert("Error", "An error occurred while fetching SiteSettings");
            }
          };
          getSiteSettings();
        }, []);
        

  return ( 
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]} >
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
    marginLeft: 10,color: theme === "dark" ? "#fff" : "#7734eb" }}>Manual Funding</Text>
</View>

<View style={{borderColor:'#7734eb',borderWidth:1,padding:30,borderRadius:10}}>
      <Text style={{ color: "gray", marginTop: 5, fontWeight: "bold" }}>
        {siteSettings.bankname}
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 13 }}>
        <Text style={{ color: "gray", fontSize: 18, fontWeight: "bold" }}>
          {siteSettings.accountno}
        </Text>
        <TouchableOpacity onPress={copyToClipboard}>
          <Feather name="copy" size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "gray", fontWeight: "bold" }}>{siteSettings.accountname}</Text>
        <TouchableOpacity onPress={toggleAccount}>
          <Ionicons name="chevron-forward" size={24} color="#111" />
        </TouchableOpacity>
      </View>
    </View>

    </View>
  )
}

export default Manual
const styles = StyleSheet.create({
  container: {
    paddingTop:getStatusBarHeight(),backgroundColor:'#fff',flex:1,   padding: 20
  },
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },

})    