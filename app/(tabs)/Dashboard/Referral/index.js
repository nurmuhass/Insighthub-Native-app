import React, { useContext,useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar,Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useRouter } from "expo-router";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import * as Clipboard from "expo-clipboard";
import { Platform, ToastAndroid, Alert } from "react-native";
import { ThemeContext } from "../../../../ThemeContext"

const index = () => {
   const [profile, setProfile] = useState(null);
  const router = useRouter();
      const { theme, toggleTheme } = useContext(ThemeContext);
    // Function to copy the referral code to clipboard
    const copyToClipboard2 = async () => {
      await Clipboard.setStringAsync(referralCode);
      
      // Show a toast message for Android, and an alert for iOS
      if (Platform.OS === "android") {
        ToastAndroid.show("Referral Code Copied!", ToastAndroid.SHORT);
      } else {
        Alert.alert("Copied!", "Referral code copied to clipboard.");
      }
    };


const referralCode = profile !=null ? profile.sPhone : '';

  useEffect(() => {
    const loadAndFetchProfile = async () => {
      try {

        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "No access token found");
          return;
        }

        const rawApiResponse = await AsyncStorage.getItem("rawApiResponse");
        if (rawApiResponse) {
          const parsedResponse = JSON.parse(rawApiResponse);     
          setProfile(parsedResponse);
        console.log(parsedResponse);
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



  return (
      <View  style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
          <StatusBar
    translucent
    barStyle="dark-content"
    backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
  />
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme === "dark" ? "#fff" : "#000"}/>
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: theme === "dark" ? "#fff" : "#7734eb" }]}>Referral</Text>

      <View style={styles.tabContainer}>
    <View style={[styles.bonusCard, { backgroundColor: theme === "dark" ? "#000" : "#f5f5f5" }]}>
      <Text style={[styles.bonusText, { color: theme === "dark" ? "#fff" : "#7734eb" }]}>Wallet</Text>
      <Text style={[styles.amount, { color: theme === "dark" ? "#fff" : "#7734eb" }]}>N {profile !=null ? profile.sWallet : ''}</Text>
    </View>
    {/* <TouchableOpacity style={styles.moveBonusButton}>
      <Text style={styles.moveBonusText}>Move Bonus to Wallet</Text>
    </TouchableOpacity> */}

    <ScrollView contentContainerStyle={styles.optionsContainer} showsVerticalScrollIndicator={false}>
<Image source={require("../../../../images/freinds.png")} style={{    width: 250,
    height: 150,
    resizeMode: "contain",
    marginVertical: 20,
    alignSelf:'center'}} />

    <Text style={[styles.inviteText, { color: theme === "dark" ? "#fff" : "#7734eb" }]}>Invite your friends and receive bonus on their transactions</Text>
    <Text style={[styles.inviteDescription, { color: theme === "dark" ? "#fff" : "#7734eb" }]}>
      Invite your friends to join and unlock exciting rewards! Simply share your referral code.
    </Text>
    <Text style={[styles.referralLabel, { color: theme === "dark" ? "#fff" : "#7734eb" }]}>Your unique referral code</Text>
    <View style={styles.referralBox}>
      <Text style={[styles.referralCode, { color: theme === "dark" ? "#fff" : "#7734eb" }]}>{referralCode}</Text>

      <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard2}>
        <Ionicons name="copy-outline" size={20} color="#fff" />
        <Text style={styles.copyText}>Copy referral code</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.referButton} onPress={copyToClipboard2}>
      <Text style={styles.referButtonText}>Refer a friend</Text>
    </TouchableOpacity>
    </ScrollView>

  </View>
    </View>
  );
}
export default index;

const styles = StyleSheet.create({
  container:{paddingTop:getStatusBarHeight(),backgroundColor:'#fff',flex:1},
  backButton: {
    margin: 15,
  },  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    alignSelf: "center",
    marginBottom: 10,
  },
  tabContainer: {
    flex: 1,
    padding: 20,
  },
  bonusCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
  },
  bonusText: {
    fontSize: 16,
    color: "#333",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  moveBonusButton: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#7734eb",
    alignItems: "center",
  },
  moveBonusText: {
    color: "#7734eb",
    fontSize: 16,
  },
  inviteText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  inviteDescription: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    color: "#777",
  },
  referralLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  referralBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7734eb",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  referralCode: {
    fontSize: 16,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7734eb",
    padding: 5,
    borderRadius: 5,
  },
  copyText: {
    color: "#fff",
    marginLeft: 5,
  },
  referButton: {
    backgroundColor: "#7734eb",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  referButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  userCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  userName: {
    fontSize: 16,
    color: "#333",
  },
});
