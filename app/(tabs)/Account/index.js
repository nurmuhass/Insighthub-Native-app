// Account.js
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Icon } from "@rneui/themed";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Ionicons } from "@expo/vector-icons";
import { signOut } from "../../../store";
import { ThemeContext } from "../../../ThemeContext"; 

const ProfileScreen = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  const menuItems = [
    { id: 1, name: "Personal Information", description: "Edit your information", icon: "person-outline", route: "Account/personalinfo" },
    { id: 3, name: "Settings", description: "Account, notification, location tracking", icon: "settings-outline", route: "Account/Settings" },
    { id: 4, name: "My Referral", description: "Referrals, commission", icon: "people-outline", route: "Dashboard/Referral" },
    { id: 5, name: "Dark Mode", description: "Toggle Dark Mode", icon: "moon-outline", action: toggleTheme }, // Toggle Theme
    { id: 6, name: "Help & Support", description: "Help or contact support", icon: "help-circle-outline", route: "Account/Support" },
    { id: 7, name: "Privacy Policy", description: "Help, Privacy & Security, Legal", icon: "document-text-outline", route: "Account/Privacy" },
    { id: 8, name: "Logout", description: "Sign out of your account", icon: "log-out-outline", action: toggleTheme, color: "red" }, // Logout Button
  ];

  const handleLogout = async () => {
    signOut();
    router.replace("/login");
  };

  const handleMenuPress = (item) => {
    if (item.action) {
      if (item.name === "Dark Mode") {
        item.action();
      }else{
         handleLogout();
      }
 
    } else if (item.route) {
      router.push(item.route); // Navigate to route
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const rawApiResponse = await AsyncStorage.getItem("rawApiResponse");
        if (rawApiResponse) {
          setProfile(JSON.parse(rawApiResponse));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    loadProfile();
  }, []);

  if (!profile) {
    return (
      <View style={[styles.center,{backgroundColor: theme === "dark" ? "#000" : "#fff"}]}>
        <Text>Error loading profile.</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="log-out-outline" type="ionicon" color="red" size={24} />
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <StatusBar translucent barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor="transparent" />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme === "dark" ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme === "dark" ? "#fff" : "#000" }]}>Profile</Text>
      </View>

      <View style={styles.header}>
        <Image source={require("../../../images/avatar.jpg")} style={styles.profileImage} />
        <Text style={[styles.userName, { color: theme === "dark" ? "#fff" : "#7734eb" }]}>{profile.sFname} {profile.sLname}</Text>
      </View>

      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => handleMenuPress(item)}>
            <Icon name={item.icon} type="ionicon" color={theme === "dark" ? "#fff" : "#333"} size={24} />
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitle, { color: theme === "dark" ? "#fff" : "#000" }]}>{item.name}</Text>
              <Text style={[styles.menuDescription, { color: theme === "dark" ? "#aaa" : "#666" }]}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 ,paddingTop:getStatusBarHeight()},
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  headerContainer: { flexDirection: "row", alignItems: "center", padding: 10 },
  headerTitle: { fontSize: 20, marginLeft: 10, fontWeight: "bold" },
  header: { alignItems: "center", paddingVertical: 30 },
  profileImage: { width: 80, height: 80, borderRadius: 30 },
  userName: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
  menuContainer: { paddingHorizontal: 20 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: "#E0E0E0" },
  menuTextContainer: { marginLeft: 15 },
  menuTitle: { fontSize: 16, fontWeight: "bold" },
  menuDescription: { fontSize: 12 },
  logoutButton: { flexDirection: "row", alignItems: "center", paddingVertical: 15, marginTop: 20, justifyContent: "center" },
  logoutText: { fontSize: 16, fontWeight: "bold", color: "red", marginLeft: 10 },
});

export default ProfileScreen;
