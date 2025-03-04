// ReAuthModal.js

import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert, 
  Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeContext } from "../ThemeContext"; 


const ReAuthModal = ({ onUnlock, onCancel,combinedData }) => {
  const router = useRouter();
      const { theme, toggleTheme } = useContext(ThemeContext);
  const [enteredPin, setEnteredPin] = useState("");
  const [storedPin, setStoredPin] = useState("");
  const [pinLength] = useState(4); 
  const digits = ["1","2","3","4","5","6","7","8","9","fingerprint","0","back"];

  useEffect(() => {
    loadUserPin();
    attemptBiometric();
  }, []);

  async function loadUserPin() {
    try {
      const rawApiResponse = await AsyncStorage.getItem("rawApiResponse");
      if (rawApiResponse) {
        try {
          const parsedResponse = JSON.parse(rawApiResponse);
          const storedSPin = parsedResponse.sPin;  // adjust this key as needed (hashed ideally)
          if (storedSPin) {
            setStoredPin(storedSPin);
 
          } else {
            console.log("PIN not found in rawApiResponse; defaulting to empty");
          }
        } catch (error) {
          console.error("Error parsing rawApiResponse:", error);
        }
      } else {
        console.log("rawApiResponse not found in storage; defaulting to empty");
      }
    } catch (error) {
      console.log("Error loading user data:", error);
    }
  }

  async function attemptBiometric() {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to continue",
      });
      if (result.success) {
        handleUnlock();
      }
    } catch (error) {
      console.log("Biometric error:", error);
    }
  }

  function handleKeyPress(key) {
    if (key === "fingerprint") {
      attemptBiometric();
      return;
    }
    if (key === "back") {
      setEnteredPin(prev => prev.slice(0, -1));
      return;
    }
    if (enteredPin.length < pinLength) {
      const newPin = enteredPin + key;
      setEnteredPin(newPin);
      if (newPin.length === pinLength) {
        verifyPin(newPin);
      }
    }
  }

  function verifyPin(pin) {
    if (pin === storedPin) {
      handleUnlock();
    } else {
      Alert.alert("Error", "Incorrect PIN. Try again.");
      setEnteredPin("");
    }
  }

  function handleUnlock() {
    if (typeof onUnlock === "function") {
      onUnlock();
    } else {
      // Fallback: navigate to Dashboard if onUnlock isn't provided.
      router.replace("/Dashboard");
    }
  }

  return (
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>

        { combinedData !=null  ?
        
        <View style={styles.avatarContainer}>
        <Text style={{alignSelf:'center',marginBottom:15,fontWeight:'bold'}}>Confirm Transaction Details</Text>
 <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:10}}>
     <Text>To:  </Text> 
     <Text style={{fontWeight:'bold'}}>{combinedData.phone}</Text> 
 </View>  
 <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:10}}>
     <Text>Amount:  </Text> 
     <Text style={{fontWeight:'bold'}}>{combinedData.amountToPay}</Text> 
 </View> 

 <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:10}}>
     <Text>Network:  </Text> 
     <Text style={{fontWeight:'bold'}}>{combinedData.network}</Text> 
 </View> 

 <View style={{flexDirection:'row', justifyContent:'space-between',marginBottom:10}}>
     <Text>Description:  </Text> 
     <Text style={{fontWeight:'bold'}}>{combinedData.desc}</Text> 
 </View> 


      </View>

      :

      null

        }
  
      <Text style={{...styles.title,marginTop:combinedData != null ? 0 : '20%'}}>Enter Passcode to confirm purchase</Text>
      {renderDots()}
      {renderKeypad()}
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  function renderDots() {
    let dots = [];
    for (let i = 0; i < pinLength; i++) {
      dots.push(
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i < enteredPin.length ? "#7734eb" : "transparent" }
          ]}
        />
      );
    }
    return <View style={styles.dotsContainer}>{dots}</View>;
  }

  function renderKeypad() {
    return (
      <View style={{...styles.keypadContainer, height: combinedData != null ? '40%' : '50%',}}>
        {digits.map((digit, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.key} 
            onPress={() => handleKeyPress(digit)}
          >
            {digit === "fingerprint" ? (
              <MaterialCommunityIcons name="fingerprint" size={40} color="#7734eb" />
            ) : digit === "back" ? (
              <Text style={styles.keyText}>{"\u2190"}</Text>
            ) : (
              <Text style={styles.keyText}>{digit}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  }
};

export default ReAuthModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: getStatusBarHeight(),
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  avatarContainer: {
    marginBottom: 40,
    backgroundColor:'#f0f0f0',
    padding: 20,
    width: '86%',
    height: '25%',
  },

  title: {
    fontSize: 16,
    fontWeight: "medium",
    marginBottom: 25,
    color: '#7734eb',
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  dot: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: "#7734eb",
    borderRadius: 7,
    marginHorizontal: 8,
  },
  keypadContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 20,
  },
  key: {
    width: "30%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  keyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7734eb",
  },
  cancelButton: {
    marginTop: 35,
    padding: 15,
    backgroundColor: "#7734eb",
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
});
