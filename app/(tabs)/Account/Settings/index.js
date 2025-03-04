import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { StatusBar } from "react-native";
import { ThemeContext } from "../../../../ThemeContext";
import {useContext, useState } from "react";

const index = () => {
  const router = useRouter();
      const { theme, toggleTheme } = useContext(ThemeContext);
  const settingsOptions = [
    {
      title: "Account Security",
      subtitle: "Change password, Biometrics and Wallet balance",
      icon: "security",
      route: "/Account/Settings/Security",
    },
    {
      title: "Notification",
      subtitle: "Push Notification, Email Notification",
      icon: "notifications",
      route: "/Account/Settings/Notification",
    },
    {
      title: "Deactivate/Delete Account",
      subtitle: "Account Deletion",
      icon: "delete",
      route: "/Account/Settings/AccountDeletion",
    },
  ];

  return (
  <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
          <StatusBar
    translucent
    barStyle="dark-content"
    backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
  />
      {/* Header */}



      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme === "dark" ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.headerText,{ color: theme === "dark" ? "#fff" : "#000" }]}>Settings</Text>
      </View>

      {/* Settings Options */}
      {settingsOptions.map((item, index) => (
        <TouchableOpacity key={index} style={[styles.option, theme === "dark" ? styles.darkContainer : styles.lightContainer]} onPress={() => router.push(item.route)}>
          <View style={styles.iconContainer}>
            <MaterialIcons name={item.icon} size={24} color={theme === "dark" ? "#000" : "#000"}/>
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.optionTitle,{ color: theme === "dark" ? "#fff" : "#000" }]}>{item.title}</Text>
            <Text style={[styles.optionSubtitle,{ color: theme === "dark" ? "#fff" : "#000" }]}>{item.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme === "dark" ? "#fff" : "#000"} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {paddingTop:getStatusBarHeight(),backgroundColor:'#fff',flex:1,   padding: 20},
  lightContainer: { backgroundColor: "#fff" },
darkContainer: { backgroundColor: "#121212" },
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
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  iconContainer: {
    backgroundColor: "#E0D4D4",
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionSubtitle: {
    color: "#7A7A7A",
    fontSize: 12,
  },
});
