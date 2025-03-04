import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import React, { useContext,useEffect, useState } from 'react'
import { ThemeContext } from "../../../ThemeContext";

const PrivacyPolicy = () => {
      const router = useRouter();
            const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <ScrollView style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>

<TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={theme === "dark" ? "#fff" : "#000"} />
      </TouchableOpacity>

      <Text style={[styles.header, { color: theme === "dark" ? "#fff" : "#000" }]}>Privacy Policy</Text>
      <Text style={[styles.date, { color: theme === "dark" ? "#fff" : "#000" }]}>Last updated: January 15, 2025</Text>
      
      <Text style={[styles.paragraph, { color: theme === "dark" ? "#fff" : "#000" }]}>
        This Privacy Policy describes Our policies and procedures on the collection, use and disclosure
        of Your information when You use the Service and tells You about Your privacy rights and how the law protects You.
      </Text>

      <Text style={[styles.subHeader, { color: theme === "dark" ? "#fff" : "#000" }]}>Interpretation and Definitions</Text>
      <Text style={[styles.subTitle, { color: theme === "dark" ? "#fff" : "#000" }]}>Interpretation</Text>
      <Text style={[styles.paragraph, { color: theme === "dark" ? "#fff" : "#000" }]}>
        The words of which the initial letter is capitalized have meanings defined under the following conditions.
      </Text>
      
      <Text style={[styles.subTitle, { color: theme === "dark" ? "#fff" : "#000" }]}>Definitions</Text>
      <Text style={[styles.bold, { color: theme === "dark" ? "#fff" : "#000" }]}>Account:</Text>
      <Text style={[styles.paragraph, { color: theme === "dark" ? "#fff" : "#000" }]}>
        A unique account created for You to access our Service or parts of our Service.
      </Text>
      
      <Text style={[styles.bold, { color: theme === "dark" ? "#fff" : "#000" }]}>Company:</Text>
      <Text style={[styles.paragraph, { color: theme === "dark" ? "#fff" : "#000" }]}>
        (referred to as either "the Company", "We", "Us" or "Our" in this Agreement) refers to Insight Hub.
      </Text>
      
      <Text style={[styles.bold, { color: theme === "dark" ? "#fff" : "#000" }]}>Cookies:</Text>
      <Text style={[styles.paragraph, { color: theme === "dark" ? "#fff" : "#000" }]}>
        Small files placed on Your computer, mobile device or any other device by a website,
        containing the details of Your browsing history among its many uses.
      </Text>
      
      <Text style={[styles.subHeader, { color: theme === "dark" ? "#fff" : "#000" }]}>Collecting and Using Your Personal Data</Text>
      <Text style={[styles.bold, { color: theme === "dark" ? "#fff" : "#000" }]}>Personal Data:</Text>
      <Text style={[styles.paragraph, { color: theme === "dark" ? "#fff" : "#000" }]}>
        While using Our Service, We may ask You to provide Us with certain personally identifiable information,
        such as Email address, First name and last name, Phone number, Address, etc.
      </Text>
      
      <Text style={[styles.bold, { color: theme === "dark" ? "#fff" : "#000" }]}>Usage Data:</Text>
      <Text style={[styles.paragraph, { color: theme === "dark" ? "#fff" : "#000" }]}>
        Usage Data is collected automatically when using the Service and may include information such as Your Device's
        IP address, browser type, browser version, pages visited, and other diagnostic data.
      </Text>
      
      <Text style={[styles.subHeader, { color: theme === "dark" ? "#fff" : "#000" }]}>Security of Your Personal Data</Text>
      <Text style={[styles.paragraph, { color: theme === "dark" ? "#fff" : "#000" }]}>
        We use commercially acceptable means to protect Your Personal Data, but remember that no method of transmission
        over the Internet, or method of electronic storage, is 100% secure.
      </Text>
      
      <Text style={[styles.subHeader, { color: theme === "dark" ? "#fff" : "#000" }]}>Contact Us</Text>
      <Text style={[styles.paragraph, { color: theme === "dark" ? "#fff" : "#000" }]}>
        If you have any questions about this Privacy Policy, You can contact us:
      </Text>
      <Text style={[styles.bold, { color: theme === "dark" ? "#fff" : "#000" }]}>By email:</Text>
      <Text style={[styles.link, { color: theme === "dark" ? "#fff" : "#000" }]}>support@insighthub.com.ng</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop:getStatusBarHeight(),
  },
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  date: {
    fontSize: 14,
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 5,
    color: "#222",
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#444",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555",
    marginBottom: 10,
  },
  bold: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    color: "#000",
  },
  link: {
    fontSize: 14,
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default PrivacyPolicy;
