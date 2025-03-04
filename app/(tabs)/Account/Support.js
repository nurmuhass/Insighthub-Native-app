
import { View, Text, TouchableOpacity, Linking, StyleSheet, Image, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import React, { useContext,useEffect, useState } from 'react';
import { ThemeContext } from "../../../ThemeContext"

const SupportScreen = () => {
  const router = useRouter();
      const { theme, toggleTheme } = useContext(ThemeContext);
  const openWhatsApp = () => {
    Linking.openURL("https://wa.me/234XXXXXXXXXX"); // Replace with your WhatsApp number
  };

  const openWhatsAppGroup = () => {
    Linking.openURL("https://chat.whatsapp.com/XXXXXXXXXXX"); // Replace with your group link
  };

  const openWebsite = () => {
    Linking.openURL("https://insighthub.com.ng/"); // Replace with your website link
  };

  return (
       <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
           <StatusBar
     translucent
     barStyle="dark-content"
     backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
   />
      {/* Back Button */}


      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme === "dark" ? "#fff" : "#000"} />
      </TouchableOpacity>

      <View style={{alignItems:'center'}}>

      {/* Title */}
      <Text style={[styles.title, { color: theme === "dark" ? "#fff" : "#000" }]}>Support</Text>
      </View>


      {/* Illustration */}
      <Image source={require("../../../images/support.png")} style={styles.image} />

      {/* Description */}
      <Text style={[styles.subtitle, { color: theme === "dark" ? "#fff" : "#000" }]}>What assistance can we offer you?</Text>
      <Text style={[styles.description, { color: theme === "dark" ? "#fff" : "#000" }]}>
        We are dedicated to ensuring you have the best possible experience. If you
        have any questions, concerns, or issues, we are here to assist you.
      </Text>

      {/* Support Options */}
      <ScrollView contentContainerStyle={styles.optionsContainer} showsVerticalScrollIndicator={false}>

        <TouchableOpacity style={[styles.optionCard,{backgroundColor:theme ==="Dark" ? "#000" : "fff"}]} onPress={openWhatsApp}>
          <Ionicons name="logo-whatsapp" size={40} color="#25D366" />
          <Text style={[styles.optionText, { color: theme === "dark" ? "#fff" : "#000" }]}>WhatsApp</Text>
          <Text style={[styles.optionSubtext, { color: theme === "dark" ? "#fff" : "#000" }]}>Say hi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionCard,{backgroundColor:theme ==="Dark" ? "#000" : "fff"}]} onPress={openWhatsAppGroup}>
          <Ionicons name="logo-whatsapp" size={40} color="#25D366" />
          <Text style={[styles.optionText, { color: theme === "dark" ? "#fff" : "#000" }]}>WhatsApp Group</Text>
          <Text style={[styles.optionSubtext, { color: theme === "dark" ? "#fff" : "#000" }]}>Join Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.optionCard,{backgroundColor:theme ==="Dark" ? "#000" : "fff"}]} onPress={openWebsite}>
          <Ionicons name="globe-outline" size={40} color="#E4405F" />
          <Text style={[styles.optionText, { color: theme === "dark" ? "#fff" : "#000" }]}>Our Website</Text>
          <Text style={[styles.optionSubtext, { color: theme === "dark" ? "#fff" : "#000" }]}>Visit Now</Text>
        </TouchableOpacity>
    
</ScrollView>

    </View>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  container:{paddingTop:getStatusBarHeight(),backgroundColor:'#fff',flex:1,padding:10},
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  backButton: {
    alignSelf: "flex-start",
    marginBottom:0
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginTop: 0,
  },
  image: {
    width: 250,
    height: 150,
    resizeMode: "contain",
    marginVertical: 20,
    alignSelf:'center'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },
  optionsContainer: {
    width: "100%", 
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",

  },
  optionCard: {
    width: "48%",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    elevation: 2,
   
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  optionSubtext: {
    fontSize: 12,
    color: "gray",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop:20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginLeft: 10,

  },
});
