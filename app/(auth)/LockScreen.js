import React, { useEffect, useState } from 'react';
import { 
  View, Text, TouchableOpacity, StyleSheet, Image, 
  Alert, Platform 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication'; // For biometric
import { useRouter } from 'expo-router';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { signOut } from '../../store';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const LockScreen = () => {
  const router = useRouter();
  
  const [enteredPin, setEnteredPin] = useState("");
  const [storedPin, setStoredPin] = useState("");
  const [pinLength] = useState(4); 
  const digits = ["1","2","3","4","5","6","7","8","9","fingerprint","0","back"];

  useEffect(() => {
    // 1. Load user PIN from AsyncStorage (or SecureStore).
    loadUserPin();
    // 2. Optionally attempt biometric right away.
    attemptBiometric();
  }, []);

  async function loadUserPin() {
    try {
        const rawApiResponse = await AsyncStorage.getItem("rawApiResponse");
        
          if (rawApiResponse) {
            try {
              // Parse the rawApiResponse JSON string into an object
              const parsedResponse = JSON.parse(rawApiResponse);
        
              // Extract the sType value from the parsed object
              const storedSPin = parsedResponse.sPin;
        
              if (storedSPin) {
                setStoredPin(storedSPin);
                console.log("User sP from storage:", storedSPin);
              } else {
                console.log("sP not found in rawApiResponse; defaulting to null");
              }
            } catch (error) {
              console.error("Error parsing rawApiResponse:", error);
            }
          } else {
            console.log("rawApiResponse not found in storage; defaulting to null");
          }
    } catch (error) {
      console.log("Error loading user data:", error);
    }
  }

  async function attemptBiometric() {
    try {
      // Check if hardware is available
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        // Device doesn’t support biometric or user not enrolled
        return;
      }
      // Prompt user
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to continue",
      });
      if (result.success) {
        // Biometric success
        onUnlock();
      } 
    } catch (error) {
      console.log("Biometric error:", error);
    }
  }

  function handleKeyPress(key) {
    if (key === "fingerprint") {
      // Attempt biometric again
      attemptBiometric();
      return;
    }
    if (key === "back") {
      // Remove last digit
      setEnteredPin((prev) => prev.slice(0, -1));
      return;
    }
    // Otherwise it's a digit
    if (enteredPin.length < pinLength) {
      const newPin = enteredPin + key;
      setEnteredPin(newPin);
      if (newPin.length === pinLength) {
        // Check pin
        verifyPin(newPin);
      }
    }
  }

  function verifyPin(pin) {
    // Compare with storedPin
    if (pin === storedPin) {
      onUnlock();
    } else {
      Alert.alert("Error", "Incorrect PIN. Try again.");
      setEnteredPin("");
    }
  }

  function onUnlock() {
    // PIN or biometric success -> navigate to main app
    // For example, push to your dashboard or set some global state
    router.replace("/Dashboard"); 
  }

  async function handleSignOut() {
    signOut();
    router.replace("/login");
  }

  // Render the dots for passcode
  const renderDots = () => {
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
  };

  // Render the keypad
  const renderKeypad = () => {
    return (
      <View style={styles.keypadContainer}>
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
  };

  return (
    <View style={{paddingTop:getStatusBarHeight(),backgroundColor:'#fff',flex:1,  alignItems: "center",}}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image 
          source={require("../../images/Profilepic.png")} 
          style={styles.avatar} 
        />
      </View>
      <Text style={styles.title}>Enter Passcode</Text>

      {/* Dots */}
      {renderDots()}

      {/* Keypad */}
      {renderKeypad()}

      {/* Sign out link */}
      <TouchableOpacity onPress={handleSignOut} style={styles.signOut}>
        <Text style={{ color: "red" }}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LockScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 5,
    alignItems: "center",
  },
  avatarContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color:'#7734eb',
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 10,
    
  },
  dot: {
    width: 14,
    height: 14,
    borderWidth: 2,
    borderColor: "#7734eb",
    borderRadius: 7,
    marginHorizontal: 15,
  },
  keypadContainer: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    height: "50%",
  
  },
  key: {
    width: "30%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    marginVertical: 15,
  },
  keyText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7734eb",
  },
  signOut: {
    marginTop: 60,
  },
});
