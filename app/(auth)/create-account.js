import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native";

const RegisterScreen = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View style={styles.container}>

      <Text style={styles.logo}>InsightHub</Text>
      <Text style={styles.title}>Create an account</Text>
      <ScrollView  showsVerticalScrollIndicator={false}>
      <InputField label="Full Name" placeholder="Enter Full Name" />
      <InputField label="Username" placeholder="Enter Username" />
      <InputField label="Email" placeholder="abc@gmail.com" keyboardType="email-address" />
      <InputField label="Phone Number" placeholder="Enter Phone number" keyboardType="phone-pad" />
      <InputField label="Address" placeholder="Enter Address" />
      <InputField label="Referral Username (Optional)" placeholder="macokorie" />

      <View style={styles.passwordContainer}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="********"
            secureTextEntry={!passwordVisible}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <MaterialIcons name={passwordVisible ? "visibility" : "visibility-off"} size={24} color="#777" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.signInText}>
        Already have an account? <Text style={styles.signInLink}>Sign In</Text>
      </Text>
      </ScrollView>
    </View>
  );
};

const InputField = ({ label, placeholder, keyboardType }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} placeholder={placeholder} keyboardType={keyboardType} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  passwordContainer: {
    marginBottom: 15,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
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
