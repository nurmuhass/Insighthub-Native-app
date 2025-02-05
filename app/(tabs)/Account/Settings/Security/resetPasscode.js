import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { getStatusBarHeight } from "react-native-status-bar-height";

const ResetPinScreen = () => {
  const router = useRouter();
  const [pin, setPin] = useState("");

  const handlePress = (value) => {
    if (pin.length < 5) {
      setPin(pin + value);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleNext = () => {
    if (pin.length === 5) {
      router.push("/next-step"); // Replace with your next step route
    }
  };

  return (
    <View style={{ paddingTop: getStatusBarHeight(), backgroundColor: "#fff", flex: 1, padding: 20 }}>
      <StatusBar translucent barStyle="dark-content" backgroundColor="rgba(255, 255, 255, 0)" />

      {/* Header */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#7734eb" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Reset Passcode</Text>
      <Text style={styles.subtitle}>
        Please enter your 5-digit PIN to start your pin changing process
      </Text>

      {/* PIN Dots */}
      <View style={styles.pinContainer}>
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <View
              key={index}
              style={[styles.pinDot, pin.length > index && styles.filledPinDot]}
            />
          ))}
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "back", pin.length === 5 ? "Next" : 0].map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.key}
            onPress={() => {
              if (item === "back") {
                handleBackspace();
              } else if (item === "Next") {
                handleNext();
              } else {
                handlePress(item);
              }
            }}
          >
            {item === "back" ? (
              <Ionicons name="arrow-back" size={24} color="#7734eb" />
            ) : (
              <Text style={[styles.keyText, item === "Next" && styles.nextText]}>{item}</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default ResetPinScreen;

const styles = StyleSheet.create({
  backButton: {
    alignSelf: "flex-start",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7734eb",
    marginTop: 30,
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#7734eb",
    textAlign: "center",
    marginTop: 20,
  },
  pinContainer: {
    flexDirection: "row",
    marginVertical: 40,
    alignSelf: "center",
  },
  pinDot: {
    width: 15,
    height: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#7734eb",
    marginHorizontal: 5,
  },
  filledPinDot: {
    backgroundColor: "#7734eb",
  },
  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
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
  nextText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#7734eb",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
});
