// login.js
import React, { useContext,useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../../ThemeContext";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { ActivityIndicator } from 'react-native';

const API_URL = "https://insighthub.com.ng/mobile/home/includes/route.php?login";

// Revised extraction function using regex
const extractTokenFromCookie = (cookieString, tokenName = 'loginAccToken') => {
  if (!cookieString) return null;
  const regex = new RegExp(tokenName + '=([^;]+)');
  const match = regex.exec(cookieString);
  return match ? match[1] : null;
};

export default function SignInScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
   const [loading, setLoading] = useState(false);
  const router = useRouter();
      const { theme, toggleTheme } = useContext(ThemeContext);
  const handleLogin = async () => {
    setLoading(true);
    if (!phone || !password) {
      setLoading(false);
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    
    // Build FormData for login
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("password", password);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        credentials: 'include', // include cookies
      });
      
      const responseText = (await response.text()).trim();
      console.log("Login response:", responseText);
    
      if (responseText === "0") {
        Alert.alert("Success", "Login Successful!");
        // Look for the set-cookie header
        const rawCookie = response.headers.get('set-cookie');
        console.log("Raw cookie header:", rawCookie);
        setLoading(false);
        if (rawCookie) {
          // Save the entire cookie string (if needed)
          await AsyncStorage.setItem('cookie', rawCookie);
          // Extract the token using the revised function
          const token = extractTokenFromCookie(rawCookie);
        
          if (token) {
            await AsyncStorage.setItem('token', token);
            console.log("Token extracted and saved:", token);
          } else {
            console.warn("Token not found in cookie");
          }
        } else {
          console.warn("No set-cookie header found!");
        }
        await AsyncStorage.setItem("loggedIn", "true");
        router.push("../(tabs)/Dashboard");
      } else if (responseText === "1") {
        Alert.alert("Error", "Incorrect Login Details, Please Try Again.");
        setLoading(false);
      } else if (responseText === "2") {
        Alert.alert("Error", "Sorry, Your Account Has Been Blocked. Please Contact Admin.");
        setLoading(false);
      } else {
        Alert.alert("Error", "Unknown error. Please contact admin.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong. Please check your network or try again later.");
      
    }
  };

  return (
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
        <StatusBar translucent barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor="transparent" />
      <Text style={[styles.logo, { color: theme === "dark" ? "#fff" : "#000" }]}>InsightHub</Text>
      <Text style={[styles.title, { color: theme === "dark" ? "#fff" : "#000" }]}>Welcome Back 👋</Text>
      <Text style={[styles.subtitle, { color: theme === "dark" ? "#fff" : "#000" }]}>Sign in to your account</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Phone Number</Text>
          <TextInput
            style={[styles.input, { color: theme === "dark" ? "#fff" : "#000" }]}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme === "dark" ? "#fff" : "#000" }]}>Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={[styles.input, { color: theme === "dark" ? "#fff" : "#000c" }]}
              placeholder="Enter your password"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.iconContainer}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={20} color="gray" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push("/forget-password")}>
          <Text style={styles.forgotPassword}>Forget Password?</Text>
        </TouchableOpacity>


 <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Sign In</Text>
        )}
      </TouchableOpacity>


        <Text style={styles.signUpText}>
          Don't have an account?{' '}
          <Text style={styles.signUpLink} onPress={() => router.push("/create-account")}>
            Sign up
          </Text>
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', justifyContent: 'center',paddingTop:getStatusBarHeight(), },
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  logo: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', color: '#7734eb', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 16, textAlign: 'center', color: 'gray', marginBottom: 20 },
  inputContainer: { marginBottom: 15 },
  label: { fontWeight: 'bold', marginBottom: 5, fontSize: 14 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 16, flex: 1 },
  passwordInputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingRight: 10 },
  iconContainer: { marginLeft: 10 },
  forgotPassword: { textAlign: 'right', color: '#7734eb', marginBottom: 20 },
  loginButton: { backgroundColor: '#7734eb', padding: 15, borderRadius: 8, alignItems: 'center' },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  signUpText: { textAlign: 'center', marginTop: 20, fontSize: 14 },
  signUpLink: { color: '#7734eb', fontWeight: 'bold' },
});
