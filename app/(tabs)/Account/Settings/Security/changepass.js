import React, { useContext,useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StatusBar, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from '../../../../../store';
import { ThemeContext } from "../../../../../ThemeContext";

const API_URL = "https://insighthub.com.ng/api/user/update_password.php";

const UpdatePasswordScreen = () => {
  const [oPass, setOPass] = useState(""); 
  const [nPass, setNPass] = useState("");
  const [cPass, setCPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("1");
  const router = useRouter();
  const { theme, toggleTheme } = useContext(ThemeContext);
       const handleLogout = async () => {
            signOut();
            router.replace("/login");
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

  const handleUpdatePassword = async () => {
    if (nPass.length < 8) {
      Alert.alert("Error", "New password must not be less than 8 characters.");
      return;
    }
  
    if (nPass !== cPass) {
      Alert.alert("Error", "New Password and Confirm Password don't match.");
      return;
    }
  
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No access token found");
        return;
      }
  
      const payload = {
        sId: userId,
        oldpass: oPass,
        newpass: nPass
      };
  
      console.log("Old Password:", oPass);
      console.log("New Password:", nPass);
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Token ${token}`
        },
        body: JSON.stringify({
          sId: userId,
          oldpass: oPass,
          newpass: nPass
        }),
      });
      
  
      const respJson = await response.json();
      console.log("Update Password Response:", respJson);
  
      if (respJson.status === "success") {
        Alert.alert("Success", "Password Updated Successfully.");
        setOPass("");
        setNPass("");
        setCPass("");
        handleLogout();
      } else if (respJson.status === "error" && respJson.msg === "Old Password Is Incorrect") {
        Alert.alert("Error", "Old Password Is Incorrect.");
        setOPass("");
      } else {
        Alert.alert("Error", "Old Password Is Incorrect.");
      }
    } catch (error) {
      console.error("Error updating password:", error);
      Alert.alert("Error", "An error occurred while updating your password.");
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={theme === "dark" ? "#fff" : "#000"} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme === "dark" ? "#fff" : "#000" }]}>Change Password</Text>
        
      </View>

      <View style={styles.form}>
            <Text style={[styles.header, { color: theme === "dark" ? "#fff" : "#7734eb" }]}>Old Password</Text>
        <TextInput 
          style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
          placeholder="Old Password"
          secureTextEntry={true}
          value={oPass}
          onChangeText={setOPass}
        />
            <Text style={[styles.header, { color: theme === "dark" ? "#fff" : "#7734eb" }]}>New Password</Text>
        <TextInput 
          style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
          placeholder="New Password"
          secureTextEntry={true}
          value={nPass}
          onChangeText={setNPass}
        />
            <Text style={[styles.header, { color: theme === "dark" ? "#fff" : "#7734eb" }]}>Confirm Password</Text>
        <TextInput 
          style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={cPass}
          onChangeText={setCPass}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleUpdatePassword} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Update Password</Text>
        )}
      </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  backIcon: {
    marginRight: 10,
  },  subtitle: {
    fontSize: 16,
    color: "#7734eb",
    textAlign: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  form: {
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
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

export default UpdatePasswordScreen;
