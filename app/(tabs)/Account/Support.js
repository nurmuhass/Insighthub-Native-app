import React from "react";
import { View, Text, TouchableOpacity, Linking, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const SupportScreen = () => {
  const router = useRouter();

  const openWhatsApp = () => {
    Linking.openURL("https://wa.me/234XXXXXXXXXX"); // Replace with your WhatsApp number
  };

  const openWhatsAppGroup = () => {
    Linking.openURL("https://chat.whatsapp.com/XXXXXXXXXXX"); // Replace with your group link
  };

  const openWebsite = () => {
    Linking.openURL("https://yourwebsite.com"); // Replace with your website link
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#7734eb" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Support</Text>

      {/* Illustration */}
      <Image source={require("../assets/support.png")} style={styles.image} />

      {/* Description */}
      <Text style={styles.subtitle}>What assistance can we offer you?</Text>
      <Text style={styles.description}>
        We are dedicated to ensuring you have the best possible experience. If you
        have any questions, concerns, or issues, we are here to assist you.
      </Text>

      {/* Support Options */}
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionCard} onPress={openWhatsApp}>
          <Ionicons name="logo-whatsapp" size={40} color="#25D366" />
          <Text style={styles.optionText}>WhatsApp</Text>
          <Text style={styles.optionSubtext}>Say hi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={openWhatsAppGroup}>
          <Ionicons name="logo-whatsapp" size={40} color="#25D366" />
          <Text style={styles.optionText}>WhatsApp Group</Text>
          <Text style={styles.optionSubtext}>Join Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionCard} onPress={openWebsite}>
          <Ionicons name="globe-outline" size={40} color="#E4405F" />
          <Text style={styles.optionText}>Our Website</Text>
          <Text style={styles.optionSubtext}>Visit Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SupportScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    alignItems: "center",
  },
  backButton: {
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7734eb",
    marginTop: 20,
  },
  image: {
    width: 250,
    height: 150,
    resizeMode: "contain",
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },
  optionsContainer: {
    width: "100%",
    alignItems: "center",
  },
  optionCard: {
    width: "80%",
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
  optionSubtext: {
    fontSize: 12,
    color: "gray",
  },
});
