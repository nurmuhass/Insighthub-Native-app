// profile.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image,  ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { Icon } from "@rneui/themed";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { Ionicons } from "@expo/vector-icons";



const ProfileScreen = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();


  const menuItems = [
    { id: 1, name: "Personal Information", description: "Edit your information", icon: "person-outline",route: "Account/personalinfo" },
    { id: 2, name: "Reports", description: "Reported Transactions", icon: "bar-chart-outline" },
    { id: 3, name: "Settings", description: "Account, notification, location tracking", icon: "settings-outline" ,route: "Account/Settings"},
    { id: 4, name: "My Referral", description: "Referrals, commission", icon: "people-outline",route: "Dashboard/Referral" },
    { id: 5, name: "Dark Mode", description: "Toggle Dark Mode", icon: "moon-outline" },
    { id: 6, name: "Help & Support", description: "Help or contact support", icon: "help-circle-outline",route: "Account/Support" },
    { id: 7, name: "Legal", description: "Help, Privacy & Security, Legal", icon: "document-text-outline" ,route: "Account/Privacy"},
  ];

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('rawApiResponse'); // Clear old data
    router.replace("/login");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log("Token from AsyncStorage in profile page:", token);
        if (!token) {
          throw new Error("No access token found");
        }
  
        const response = await fetch('https://insighthub.com.ng/api/user/index.php', {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Accept': 'application/json'
          },
        });
        
        console.log("Response status:", response.status);
        
        const responseText = await response.text();
        console.log("Response text:", responseText);
        
        let json;
        try {
          json = JSON.parse(responseText);
        } catch (e) {
          console.error("Error parsing JSON:", e);
        }
        
        console.log("Raw API Response:", json);
  
        if (!json || json.status === "fail") {
          console.error('Error:', json ? json.msg : "No data returned");
          setProfile(null);
        } else {
          // Remove the status field and use the remaining keys as profile data.
          const { status, ...profileData } = json;
          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchProfile();
  }, []);
  

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7734eb" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>Error loading profile.</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Icon name="log-out-outline" type="ionicon" color="red" size={24} />
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        <Text style={styles.userName}>{profile.sFname} {profile.sLname}</Text>
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
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
