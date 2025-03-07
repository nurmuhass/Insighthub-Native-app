import React, { useContext,useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { ThemeContext } from "../../ThemeContext";
import { ActivityIndicator } from "react-native";

const RegisterScreen = () => {
  // State for registration fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [stateValue, setStateValue] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [transPin, setTransPin] = useState("");
  const [referral, setReferral] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
const [loading, setLoading] = useState(false);

  const router = useRouter();
  // Use the URL without appending ?register because we send action in the form data.
  const API_URL = "https://insighthub.com.ng/mobile/home/includes/route.php?register";

  const handleRegister = async () => {

    setLoading(true);
    // Validate required fields
    if (!firstName || !lastName || !phone || !email || !stateValue || !password || !confirmPassword || !transPin) {
      setLoading(false);
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }
    if (password.length < 8) {
      setLoading(false);
      Alert.alert("Error", "Password should be at least 8 characters.");
      return;
    }
    if (password.length > 15) {
      setLoading(false);
      Alert.alert("Error", "Password should not be more than 15 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setLoading(false);
      Alert.alert("Error", "Password and Confirm Password do not match.");
      return;
    }
    if (password === phone) {
      setLoading(false);
      Alert.alert("Error", "You can't use your phone number as password.");
      return;
    }

    // Create FormData (as your backend expects form data)
    const formData = new FormData();
    formData.append("fname", firstName);
    formData.append("lname", lastName);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("state", stateValue);
    formData.append("password", password);
    formData.append("cpassword", confirmPassword);
    formData.append("transpin", transPin);
    formData.append("referal", referral);

    try {
      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response Data:", response.data);

      // The website's AJAX compares the response as numbers:
      if (response.data == 0) {
        setLoading(false);
        Alert.alert("Success", "Registration Successful");
        router.push("/login");
      } else if (response.data == 1) {
        setLoading(false);
        Alert.alert("Error", "Email & Phone Number Already Exist.");
      } else if (response.data == 2) {
        setLoading(false);
        Alert.alert("Error", "Email Already Exist.");
      } else if (response.data == 3) {
        setLoading(false);
        Alert.alert("Error", "Phone Number Already Exist.");
      } else {
        setLoading(false);
        Alert.alert("Error", "Unknown error. Please contact admin.");
      }
    } catch (error) {
      console.error("Registration error:", error.response ? error.response.data : error.message);
      Alert.alert("Error", "Something went wrong. Please check your network or try again later.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>InsightHub</Text>
      <Text style={styles.title}>Create an account</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <InputField label="First Name" placeholder="Enter First Name" value={firstName} onChangeText={setFirstName} />
        <InputField label="Last Name" placeholder="Enter Last Name" value={lastName} onChangeText={setLastName} />
        <InputField label="Phone Number" placeholder="Enter Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <InputField label="Email" placeholder="Enter Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <InputField label="State" placeholder="Enter State" value={stateValue} onChangeText={setStateValue} />
        <PasswordField
          label="Password"
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          toggleVisibility={() => setPasswordVisible(!passwordVisible)}
        />
        <PasswordField
          label="Confirm Password"
          placeholder="Enter Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!confirmPasswordVisible}
          toggleVisibility={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
        />


<Text style={styles.label}>Transaction Pin</Text>
   <TextInput
      style={styles.input}
     value={transPin}  
      onChangeText={setTransPin}
      maxLength={4}
    placeholder="Enter Transaction Pin(Max 4)"
            keyboardType="number-pad"
    />
    
        <InputField label="Referral (Optional)" placeholder="Enter Referral" value={referral} onChangeText={setReferral} />
      

<TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerText}>Register</Text>
        )}
      </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.signInText}>
            Already have an account? <Text style={styles.signInLink}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// A simple input field component
const InputField = ({ label, placeholder, value, onChangeText, keyboardType }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
    />
  </View>
);

// A password field component with a toggle to show/hide password
const PasswordField = ({ label, placeholder, value, onChangeText, secureTextEntry, toggleVisibility }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.passwordInputContainer}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      <TouchableOpacity onPress={toggleVisibility}>
        <Text style={styles.toggleText}>{secureTextEntry ? "Show" : "Hide"}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    paddingTop:getStatusBarHeight()
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#7734eb",
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
  },
  toggleText: {
    marginLeft: 10,
    color: "#7734eb",
    fontWeight: "bold",
  },
  registerButton: {
    backgroundColor: "#7734eb",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signInText: {
    textAlign: "center",
    marginTop: 15,
    fontSize: 14,
  },
  signInLink: {
    color: "#7734eb",
    fontWeight: "bold",
  },
});

export default RegisterScreen;
