import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, StatusBar } from "react-native";
import { Icon } from "@rneui/themed";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


const ProfileScreen = () => { 
  const menuItems = [
    { id: 1, name: "Personal Information", description: "Edit your information", icon: "person-outline",route: "Account/personalinfo" },
    { id: 2, name: "Reports", description: "Reported Transactions", icon: "bar-chart-outline" },
    { id: 3, name: "Settings", description: "Account, notification, location tracking", icon: "settings-outline" ,route: "Account/Settings"},
    { id: 4, name: "My Referral", description: "Referrals, commission", icon: "people-outline",route: "Dashboard/Referral" },
    { id: 5, name: "Dark Mode", description: "Toggle Dark Mode", icon: "moon-outline" },
    { id: 6, name: "Help & Support", description: "Help or contact support", icon: "help-circle-outline",route: "Account/Support" },
    { id: 7, name: "Legal", description: "Help, Privacy & Security, Legal", icon: "document-text-outline" ,route: "Account/Privacy"},
  ];
  const router = useRouter(); // Initialize the router
  return (
     <View style={{paddingTop:getStatusBarHeight(),backgroundColor:'#fff',flex:1}}>
          <StatusBar
    translucent
    barStyle="dark-content"
    backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
  />
  <View style={{flexDirection:'row',alignItems:'center',padding:10}}>

<TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#7734eb" />
  </TouchableOpacity>
  
  <Text style={{fontSize:20,marginLeft:10,fontWeight:'bold'}}>Profile</Text>
</View>
      {/* Profile Header */}
      <View style={styles.header}>
      <Image source={require("../../../images/Profilepic.png")} resizeMethod="contain" style={{width:80,height:80,borderRadius:30}}/>
        <Text style={styles.userName}>Nur Muhass</Text>
      </View>

      {/* Menu Options */}
      <ScrollView style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity key={item.id} style={styles.menuItem}    onPress={() => {
          
              router.push(item.route);
            
          }}>
            <Icon name={item.icon} type="ionicon" color="#333" size={24} />
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>{item.name}</Text>
              <Text style={styles.menuDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Icon name="log-out-outline" type="ionicon" color="red" size={24} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF9F6" },
  header: { alignItems: "center", paddingVertical: 30 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  userName: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
  menuContainer: { paddingHorizontal: 20 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  menuTextContainer: { marginLeft: 15 },
  menuTitle: { fontSize: 16, fontWeight: "bold" },
  menuDescription: { fontSize: 12, color: "#666" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    marginTop: 20,
    justifyContent: "center",
  },
  logoutText: { fontSize: 16, fontWeight: "bold", color: "red", marginLeft: 10 },
});

export default ProfileScreen;
