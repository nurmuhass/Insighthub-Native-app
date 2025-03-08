import { View, Text, Image, TouchableOpacity,ToastAndroid, Platform, Alert, FlatList, StyleSheet, Modal, ActivityIndicator, TouchableWithoutFeedback } from 'react-native'
import React, { useContext,useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { getStatusBarHeight } from "react-native-status-bar-height";
import AntDesign from '@expo/vector-icons/AntDesign';
import { FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import {  Badge  } from '@rneui/themed';
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import * as Clipboard from "expo-clipboard";
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from "../../../ThemeContext"; 
import NetInfo from '@react-native-community/netinfo';

const API_URL = "https://insighthub.com.ng/api/user/fundWallet.php";

const index = () => {
 const [profile, setProfile] = useState(null);
  const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [walletData, setWalletData] = useState(null);
  const router = useRouter(); // Initialize the router
    const [userId, setUserId] = useState();
      const { theme, toggleTheme } = useContext(ThemeContext);
  // Define two sets of data
  

    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log("Token from AsyncStorage in home page:", token);
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
       
        setUserId(json.sId);
    // Save the raw API response in AsyncStorage
    if (json) {
      await AsyncStorage.setItem('rawApiResponse', JSON.stringify(json));
              
    }
        if (!json || json.status === "fail") {
          console.error('Error:', json ? json.msg : "No data returned");
          setProfile(null);
          return;
        } else {
          // Remove the status field and use the remaining keys as profile data.
          const { status, ...profileData } = json;
          setProfile(profileData);
        }
      } catch (error) {
        // console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      // Initial fetch when component mounts
      fetchProfile();
  
      // Set an interval to call fetchProfile every 10 seconds for real-time updates
      const intervalId = setInterval(() => {
        fetchProfile();
      }, 10000); // 10 seconds
  
      // Clear the interval when component unmounts
      return () => clearInterval(intervalId);
    }, []); // Empty dependency array to run this effect once on mount
  

  useEffect(() => {
    const fetchWalletDetails = async () => {
   
      if (!userId || userId === "1")  return; // Ensure userId is available before making API call

      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "No access token found");
          return;
        }

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
          body: JSON.stringify({ sId: userId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API result:", result);

        if (result.status === "success") {
          setWalletData(result.wallet_details);
        } else {

        }
      } catch (error) {
        console.error("Error fetching wallet details:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchWalletDetails();
  }, [userId]); // Re-fetch when userId changes

  
  

  // Copy account number to clipboard
  const copyToClipboard = () => {
    if (Array.isArray(walletData) && walletData.length > index) {
      const accountNumber = walletData[index].account_no;
      Alert.alert("Copied", `Account number ${accountNumber} copied!`);
    }
  };

  // Toggle between accounts
  const toggleAccount = () => {
    if (walletData) {
      setIndex((prevIndex) => (prevIndex + 1) % walletData.length);
    }
  };
  const referralCode = profile !=null ? profile.sPhone : '';

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

  const [isConnected, setIsConnected] = useState(null);
  
  useEffect(() => {
    // Check the network status when the component mounts
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected); // Updates the state with the connection status
    });

    // Cleanup the event listener when the component unmounts
    return () => unsubscribe();
  }, []);

 
  // Show the connection status in the UI

  
  

  const [showBalance, setShowBalance] = useState(false);



  const services = [
    { id: 1, name: "Data", icon: <FontAwesome5 name="globe" size={30} color='#7734eb'  />, route: "Dashboard/BuyData" },
    { id: 2, name: "Airtime", icon: <MaterialIcons name="stay-primary-portrait" size={30} color='#7734eb' />, route: "Dashboard/BuyAirtime" },
    { id: 3, name: "Electricity", icon: <MaterialIcons name="lightbulb-outline" size={30} color='#7734eb' />, route: "Dashboard/Electricity" },
    { id: 4, name: "Cable Tv", icon: <MaterialIcons name="live-tv" size={30}color='#7734eb'  />, route: "Dashboard/PayCable" },
    { id: 5, name: "Airtime Swap", icon: <FontAwesome5 name="exchange-alt" size={30} color='#7734eb'  />, route: "Dashboard/AirtimeSwap" },
    { id: 6, name: "More Services", icon: <Entypo name="dots-three-horizontal" size={30}color='#7734eb'  />, route: null },
  ];
  
const moreServices = [
  { id: 1, name: "Buy Data", icon: <FontAwesome5 name="globe" size={30} color="#7734eb" /> , route: "Dashboard/BuyData"},
  { id: 2, name: "Airtime", icon: <MaterialIcons name="stay-primary-portrait" size={30} color='#7734eb' />, route: "Dashboard/BuyAirtime" },
  { id: 3, name: "Electricity", icon: <MaterialIcons name="lightbulb-outline" size={30} color='#7734eb' />, route: "Dashboard/Electricity" },
  { id: 4, name: "Cable Tv", icon: <MaterialIcons name="live-tv" size={30}color='#7734eb' />, route: "Dashboard/PayCable"},
  { id: 5, name: "Edu Pins", icon: <FontAwesome5 name="book-open" size={30} color='#7734eb'/> , route: "Dashboard/EduPin"},
  { id: 6, name: "Bulk SMS", icon: <FontAwesome5 name="sms" size={30} color='#7734eb' /> , route: "Dashboard/AirtimeSwap"},
  { id: 7, name: "Recharge Pin", icon: <FontAwesome5 name="credit-card" size={30} color='#7734eb' /> ,route: "Dashboard/BuyAirtime"},
  { id: 8, name: "Airtime Swap", icon: <FontAwesome5 name="exchange-alt" size={30} color='#7734eb' /> , route: "Dashboard/AirtimeSwap" },
];
  const [modalVisible, setModalVisible] = useState(false);


  if (!isConnected) {
    return (
      <View style={{ flex: 1,paddingTop:getStatusBarHeight(),backgroundColor:'#fff'}}>
  <View style={{ justifyContent:'space-between',flexDirection:'row',marginBottom:30}}>
      
      <View style={{flexDirection:'row',justifyContent:'center'}}>
       <Image source={require("../../../images/logo.png")} style={{width:50,height:50,marginTop:13,marginLeft:5}}/>

    </View>
    <Text style={{fontSize:28,fontWeight:'bold',marginTop:17,marginRight:15}}>InsightHub</Text>
  
  </View>  
      <View style={styles.noConnectionContainer}>
        <Entypo name="network" size={72} color="black" />
        <Text style={styles.noConnectionText}>Please check your internet connection.</Text>
      </View>

      </View>

    );
  }

    if (loading) {
      return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor: theme === "dark" ? "#000" : "#fff"}}>
          <ActivityIndicator size="large" color="#7734eb" />
        </View>
      );
    }

  return (
  
      <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
  <StatusBar translucent barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor="transparent" />
    <View style={{justifyContent:"space-between",flexDirection:'row',alignItems:'center'}}>
      <View style={{flexDirection:'row',alignItems:'center'}}>
      <Image source={require("../../../images/avatar.jpg")} resizeMethod="contain" style={{width:40,height:40,marginRight:10,marginLeft:8,borderRadius:10}}/>
<View>
  <Text  style={ { color: theme === "dark" ? "#fff" : "#000" }}><Text>{profile ? `${profile.sFname || ''} ${profile.sLname || ''}` : '' }</Text>
  </Text>
  <View style={{flexDirection:'row',alignItems:'center'}}>
  <Text style={ { color: theme === "dark" ? "#fff" : "#000" }}>Welcome Back</Text>
  {theme === "dark" ? (
 <Image source={require("../../../images/clap2.jpg")} resizeMethod="contain" style={{width:28,height:20,marginLeft:5}}/>
  ) : (
    <Image source={require("../../../images/clap.jpeg")} resizeMethod="contain" style={{width:28,height:20,marginLeft:5}}/>
  )

  }
 
  </View>
  
</View>
      </View>
  <View>
  <TouchableOpacity onPress={() => {router.push("Dashboard/Notifications");}}  style={{justifyContent:'flex-end',marginRight:'4%'}}>
    <Ionicons name="notifications" size={24} color={theme === "dark" ? "#fff" : "#7734eb"}  />
   { 1 !=0 ?  (
    <Badge
            status="primary"
            value={1}
            containerStyle={{ position: 'absolute', top: -7, left: 18 }}
          />
   )
   :''
          }
</TouchableOpacity>
  </View>
    
    </View>

<View style={{backgroundColor:"#7734eb",padding:20,width:'96%',height:200,alignSelf:'center',marginTop:15,borderRadius:10}}>

<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <View style={{ alignItems: "flex-start" }}>
        <Text style={{ fontSize: 18, color: "#fff" }}> Wallet Balance </Text>
        <Text style={{ fontWeight: "bold", marginTop: 7, fontSize: 22, color: "#fff",marginLeft:5 }}>
          {showBalance ? profile.sWallet ? profile.sWallet : 0 : "**************"}
        </Text>
        {/* <Text style={{ fontSize: 18, color: "#fff", marginTop: 10 }}>CashBack Balance: 0.0</Text> */}
      </View>

      <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
        {showBalance ? (
          <Feather name="eye" size={24} color="white" />
        ) : (
          <Entypo name="eye-with-line" size={24} color="white" />
        )}
      </TouchableOpacity>
    </View>

<View style={{borderWidth:0.8,borderColor:'#fff',marginTop:10}}></View>
     
<View>
  <Text style={{ color: "#fff", marginTop: 5, fontWeight: "bold" }}>
    {walletData && walletData[index] ? walletData[index].bank_name : "N/A"}
  </Text>

  <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 8 }}>
    <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
      {walletData && walletData[index] ? walletData[index].account_no : "N/A"}
    </Text>
    <TouchableOpacity onPress={copyToClipboard}>
      <Feather name="copy" size={24} color="white" />
    </TouchableOpacity>
  </View>

  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
    <Text style={{ color: "#fff", fontWeight: "bold" }}>
      {walletData && walletData[index] ? walletData[index].charges : "N/A"}
    </Text>
    <TouchableOpacity onPress={toggleAccount}>
      <Ionicons name="chevron-forward" size={24} color={theme === "dark" ? "#fff" : "#fff"} />
    </TouchableOpacity>
  </View>
</View>


</View>

<View style={{marginTop:8,marginLeft:8}}>
      <Text style={{ fontSize: 20,color: theme === "dark" ? "#fff" : "#000" }}>Your Referral Code</Text>

      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10,justifyContent:'space-between',
      marginRight:10,marginTop:12,backgroundColor:"#f0f0f0",padding:10,borderRadius:10
       }}>
        <Text style={{ fontSize: 16, marginLeft: 10 }}>{referralCode}</Text>
        <TouchableOpacity onPress={copyToClipboard2}>
          <Feather name="copy" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>

<View style={{marginTop:14,marginLeft:8,flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginHorizontal:'2%'}}>

<TouchableOpacity style={{backgroundColor:"#7734eb",padding:10,borderRadius:10,
width:'48%',
  height:50,justifyContent:'center',
  flexDirection:'row',alignItems:'center'}} onPress={() => {router.push("Dashboard/FundWallet");}}>
<Ionicons name="add-circle-outline" size={24} color="#fff" />
<Text style={{alignSelf:'center',color:'#fff'}}>Fund Wallet</Text>
</TouchableOpacity>

<TouchableOpacity style={{backgroundColor:"#7734eb",padding:10,borderRadius:10,width:'48%',height:50,
  justifyContent:'center',flexDirection:'row',alignItems:'center'}} onPress={() => {router.push("Dashboard/Referral");}}>
<FontAwesome name="users" size={18} color="#fff"  />
<Text style={{alignSelf:'center',color:'#fff',marginLeft:3}}>Referral</Text>
</TouchableOpacity>


</View>

 <View style={{padding: 15, borderRadius: 15 ,marginTop:20,zIndex: 1}}>
      <Text style={[styles.headerText, { color: theme === "dark" ? "#fff" : "#7734eb" }]}>Our Services</Text>

      <FlatList
      data={services}
      numColumns={3}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.serviceButton}
          onPress={() => {
            if (item.name === "More Services") {
              setModalVisible(true);
            } else {
              router.push(item.route);
            }
          }}
        >
          {item.icon}
          <Text style={[styles.serviceText, { color: theme === "dark" ? "#fff" : "#000" }]}>{item.name}</Text>
        </TouchableOpacity>
      )}
    />

      {/* Modal for More Services */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
  <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
    <View style={styles.modalContainer}>
      <View style={[styles.modalContent, { backgroundColor: theme === "dark" ? "#000" : "#fff" }]}>
        {/* Modal Content */}
        <FlatList
          data={moreServices}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.modalButton} onPress={() => router.push(item.route)}>
              {item.icon}
              <Text style={[styles.modalText, { color: theme === "dark" ? "#7734eb" : "#000" }]}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableWithoutFeedback>
</Modal>
    </View>

    </View>
  )
}


const styles = StyleSheet.create({
  container: { paddingTop:getStatusBarHeight(),backgroundColor:'#fff',flex:1},
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  headerText: { fontSize: 20, fontWeight: "bold", color: "#7734eb", marginBottom: 15 },
  serviceButton: { alignItems: "center", flex: 1, marginVertical: 15 },
  serviceText: { fontSize: 14, fontWeight: "bold", marginTop: 5, color: "black" },
  modalContainer: { flex: 1, justifyContent: "flex-end", alignItems: "center",},
  modalContent: { backgroundColor: "white", padding: 20,borderTopRightRadius:25,borderTopLeftRadius:25, width: "100%", alignItems:'bottom' },
  modalHeader: { fontSize: 18, fontWeight: "bold", color: "#555", marginBottom: 15 },
  modalButton: { backgroundColor: "#f0f0f0", padding: 15, borderRadius: 10, margin: 4, alignItems: "center", width: "48%" },
  modalText: { fontSize: 14, fontWeight: "bold", color: "black", marginTop: 5 },
  closeButton: { marginTop: 15, padding: 10, backgroundColor: "#d9534f", borderRadius: 10 },
  closeText: { color: "white", fontWeight: "bold" },
  noConnectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  noConnectionText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
});


export default index