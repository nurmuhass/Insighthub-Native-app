import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState(1);       // 1: Email, 2: Code, 3: New Password
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. Send Email to get user code => route.php?get-user-code
  const handleSendCode = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("email", email);
  
      const response = await fetch(
        "https://insighthub.com.ng/mobile/home/includes/route.php?get-user-code",
        {
          method: "POST",
          body: formData,
        }
      );
      
      // Trim the response to remove extra whitespace/newlines.
      const respText = (await response.text()).trim();
      console.log("handleSendCode:", respText);
  
      if (respText === "0") {
        Alert.alert("Success", "A verification code has been sent to your email address.");
        setStep(2);
      } else if (respText === "1") {
        Alert.alert("Error", "Email not found. Please check your email and try again.");
      } else {
        Alert.alert("Error", "Unknown error. Please contact support.");
      }
    } catch (error) {
      console.error("Send code error:", error);
      Alert.alert("Error", "Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  // 2. Verify Code => route.php?verify-user-code
  const handleVerifyCode = async () => {
    if (!code) {
      Alert.alert("Error", "Please enter your verification code");
      return;
    }
    setLoading(true);
  
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("code", code);
  
      const response = await fetch(
        "https://insighthub.com.ng/mobile/home/includes/route.php?verify-user-code",
        {
          method: "POST",
          body: formData,
        }
      );
      const respText = (await response.text()).trim();
      console.log("handleVerifyCode:", respText);
  
      if (respText === "0") {
        Alert.alert("Success", "Code verified. Please enter your new password.");
        setStep(3);
      } else if (respText === "1") {
        Alert.alert("Error", "Incorrect code. Please try again.");
      } else {
        Alert.alert("Error", "Unknown error. Please contact support.");
      }
    } catch (error) {
      console.error("Verify code error:", error);
      Alert.alert("Error", "Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  // 3. Update User Password => route.php?update-user-pass
  const handleUpdatePassword = async () => {
    // Validate password
    if (password !== password2) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long");
      return;
    }
    if (password.length > 15) {
      Alert.alert("Error", "Password must be at most 15 characters long");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("code", code);
      formData.append("password", password);
      formData.append("password2", password2);

      const response = await fetch(
        "https://insighthub.com.ng/mobile/home/includes/route.php?update-user-pass",
        {
          method: "POST",
          body: formData,
        }
      );
      const respText = (await response.text()).trim();
      console.log("handleUpdatePassword:", respText);

      if (respText === "0") {
        Alert.alert(
          "Success",
          "Password updated successfully. You can now log in."
        );
        // Optionally reset the form or navigate to login screen
        router.push("/login");
      } else if (respText === "1") {
        Alert.alert("Error", "Unable to update password. Please try again.");
      } else {
        Alert.alert("Error", "Unknown error. Please contact support.");
      }
    } catch (error) {
      console.error("Update password error:", error);
      Alert.alert("Error", "Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Step-based UI
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>InsightHub</Text>
      <Text style={styles.title}>Forgot Password</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Step 1: Enter Email */}
        {step === 1 && (
          <>
            <Text style={styles.subtitle}>
              Enter the email address associated with your account
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSendCode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Recover Password</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* Step 2: Enter Verification Code */}
        {step === 2 && (
          <>
            <Text style={styles.subtitle}>
              A verification code was sent to your email.
            </Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter the code"
                value={code}
                onChangeText={setCode}
                keyboardType="numeric"
              />
            </View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleVerifyCode}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Verify Code</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* Step 3: Update Password */}
        {step === 3 && (
          <>
            <Text style={styles.subtitle}>Enter your new password below</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Retype Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Retype new password"
                secureTextEntry
                value={password2}
                onChangeText={setPassword2}
              />
            </View>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleUpdatePassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Update Password</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        {/* Link to Login */}
        <TouchableOpacity
          style={styles.backToLogin}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// Example styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    paddingTop:getStatusBarHeight()
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7734eb",
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#7734eb",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  backToLogin: {
    marginTop: 20,
    alignItems: "center",
  },
  backToLoginText: {
    color: "#7734eb",
    fontSize: 14,
    fontWeight: "bold",
  },
});
