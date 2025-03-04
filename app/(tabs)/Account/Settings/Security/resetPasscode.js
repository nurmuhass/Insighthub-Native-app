import React, {useContext, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  ActivityIndicator, 
  Alert 
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from '../../../../../store';
import { ThemeContext } from "../../../../../ThemeContext";

const API_URL = "https://insighthub.com.ng/api/user/update_transaction_pin.php";

const resetPasscode = () => {
  const router = useRouter();
 
  // Step 1: Old PIN, Step 2: New PIN and confirmation
  const [step, setStep] = useState(1);
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
   const [userId, setUserId] = useState("1");
  const { theme, toggleTheme } = useContext(ThemeContext);
  // sId from API response
  const [sId, setSId] = useState("1");

     const handleLogout = async () => {
          signOut();
          router.replace("/login");
        };

  // Load sId from AsyncStorage on mount
  useEffect(() => {
    const loadUserId = async () => {
      try {
        const rawApiResponse = await AsyncStorage.getItem("rawApiResponse");
        if (rawApiResponse) {
          const parsedResponse = JSON.parse(rawApiResponse);
          setSId(parsedResponse.sId);
          console.log("Profile loaded:", parsedResponse);
        } else {
          console.log("rawApiResponse not found in storage.");
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        Alert.alert("Error", "An error occurred while fetching your profile");
      }
    };

    loadUserId();
  }, []);

  const handleNextStep = () => {
    if (oldPin.length !== 4) {
      Alert.alert("Error", "Old PIN must be exactly 4 digits.");
      return;
    }
    setStep(2);
  };

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
          setUserId(parsedResponse.sId);
          console.log("Profile loaded:", parsedResponse);
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
  const handleUpdatePin = async () => {
    if (newPin.length !== 4 || confirmPin.length !== 4) {
      Alert.alert("Error", "New PIN and Confirm PIN must be exactly 4 digits.");
      return;
    }
    if (newPin !== confirmPin) {
      Alert.alert("Error", "New PIN and Confirm PIN do not match.");
      return;
    }
    setLoading(true);
  
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
          "Authorization": token,
        },
        body: JSON.stringify({ 
          sId: userId,
          oldPin: oldPin,
          newPin: newPin}),
      });

      const result = await response.json();
      console.log("Response:", result);
  
      if (result.status === "success") {
        Alert.alert("Success", "Transaction PIN updated successfully.");
        setOldPin("");
        setNewPin("");
        setConfirmPin("");
        setStep(1); // Reset to first step
        handleLogout();
      } else {
        Alert.alert("Error", result.msg || "Failed to update transaction PIN check current pin and retry.");
        setOldPin("");
        setNewPin("");
        setConfirmPin("");
        setStep(1);
      }
    } catch (error) {
      console.error("Error updating PIN:", error);
      Alert.alert("Error", "An error occurred while updating your PIN.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <StatusBar 
        translucent 
        barStyle="dark-content" 
        backgroundColor="rgba(255,255,255,0)" 
      />
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme === "dark" ? "#fff" : "#000"} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: theme === "dark" ? "#fff" : "#7734eb" }]}>Reset PIN</Text>

      {step === 1 && (
        <>
          <Text style={[styles.subtitle, { color: theme === "dark" ? "#fff" : "#7734eb" }]}>Enter your current 4-digit PIN to begin.</Text>
          <TextInput
            style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
            placeholder="Old PIN"
            keyboardType="number-pad"
            value={oldPin}
            onChangeText={setOldPin}
            secureTextEntry
            maxLength={4}
          />
          <TouchableOpacity style={styles.button} onPress={handleNextStep} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Next</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={[styles.subtitle, { color: theme === "dark" ? "#fff" : "#7734eb" }]}>Enter your new 4-digit PIN and confirm it.</Text>
          <TextInput
            style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
            placeholder="New PIN"
            keyboardType="number-pad"
            value={newPin}
            onChangeText={setNewPin}
            secureTextEntry
            maxLength={4}
          />
          <TextInput
            style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
            placeholder="Confirm New PIN"
            keyboardType="number-pad"
            value={confirmPin}
            onChangeText={setConfirmPin}
            secureTextEntry
            maxLength={4}
          />
          <TouchableOpacity style={styles.button} onPress={handleUpdatePin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Update PIN</Text>
            )}
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: getStatusBarHeight(),
    paddingHorizontal: 20,
  },
  lightContainer: { backgroundColor: "#fff" },
darkContainer: { backgroundColor: "#121212" },
  backButton: {
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7734eb",
    marginVertical: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#7734eb",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    height: 50,
  },
  button: {
    backgroundColor: "#7734eb",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default resetPasscode;
