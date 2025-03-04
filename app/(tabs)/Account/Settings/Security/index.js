import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext,useState } from "react";
import { StatusBar } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { ThemeContext } from "../../../../../ThemeContext";

const index = () => {
  const router = useRouter();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [walletBalanceVisible, setWalletBalanceVisible] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const securityOptions = [
    {
      title: "Change Password",
      subtitle: "Change your account password",
      icon: "lock-outline",
      route: "/Account/Settings/Security/changepass",
    },
    {
      title: "Change Passcode",
      subtitle: "Change your Passcode",
      icon: "security",
      route: "/Account/Settings/Security/changePassCode",
    },
    {
      title: "Reset Passcode",
      subtitle: "Reset your Passcode",
      icon: "vpn-key",
      route: "/Account/Settings/Security/resetPasscode",
    },
  ];

  return (
   <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
           <StatusBar
     translucent
     barStyle="dark-content"
     backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
   />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24}  color={theme === "dark" ? "#fff" : "#000"}  />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: theme === "dark" ? "#fff" : "#000" }]}>Security</Text>
      </View>

      {/* Security Options */}
      {securityOptions.map((item, index) => (
        <TouchableOpacity key={index} style={[styles.option, theme === "dark" ? styles.darkContainer : styles.lightContainer]} onPress={() => router.push(item.route)}>
          <View style={styles.iconContainer}>
            <MaterialIcons name={item.icon} size={24}  color={theme === "dark" ? "#000" : "#000"}  />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.optionTitle, { color: theme === "dark" ? "#fff" : "#000" }]}>{item.title}</Text>
            <Text style={[styles.optionSubtitle, { color: theme === "dark" ? "#fff" : "#000" }]}>{item.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20}  color={theme === "dark" ? "#fff" : "#000"}  />
        </TouchableOpacity>
      ))}

      {/* Toggle Switches */}
      <View style={[styles.option, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="fingerprint" size={24}  color={theme === "dark" ? "#000" : "#000"}  />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.optionTitle, { color: theme === "dark" ? "#fff" : "#000" }]}>Biometric</Text>
          <Text style={[styles.optionSubtitle, { color: theme === "dark" ? "#fff" : "#000" }]}>Activate Face ID or Fingerprint</Text>
        </View>
        <Switch value={biometricEnabled} onValueChange={() => setBiometricEnabled(!biometricEnabled)} />
      </View>

      <View style={[styles.option, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="visibility" size={24}  color={theme === "dark" ? "#000" : "#000"}  />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.optionTitle, { color: theme === "dark" ? "#fff" : "#000" }]}>Show Wallet Balance</Text>
          <Text style={[styles.optionSubtitle, { color: theme === "dark" ? "#fff" : "#000" }]}>Hide or show wallet balance</Text>
        </View>
        <Switch value={walletBalanceVisible} onValueChange={() => setWalletBalanceVisible(!walletBalanceVisible)} />
      </View>

    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container:{paddingTop:getStatusBarHeight(),backgroundColor:'#fff',flex:1,   padding: 20},
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop:20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginLeft: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  iconContainer: {
    backgroundColor: "#E0D4D4",
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionSubtitle: {
    color: "#7A7A7A",
    fontSize: 12,
  },
});
