import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StatusBar } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

const index = () => {
  const router = useRouter();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [walletBalanceVisible, setWalletBalanceVisible] = useState(false);

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
   <View style={{paddingTop:getStatusBarHeight(),backgroundColor:'#fff',flex:1,   padding: 20,}}>
           <StatusBar
     translucent
     barStyle="dark-content"
     backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
   />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Security</Text>
      </View>

      {/* Security Options */}
      {securityOptions.map((item, index) => (
        <TouchableOpacity key={index} style={styles.option} onPress={() => router.push(item.route)}>
          <View style={styles.iconContainer}>
            <MaterialIcons name={item.icon} size={24} color="black" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>{item.title}</Text>
            <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="black" />
        </TouchableOpacity>
      ))}

      {/* Toggle Switches */}
      <View style={styles.option}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="fingerprint" size={24} color="black" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>Biometric</Text>
          <Text style={styles.optionSubtitle}>Activate Face ID or Fingerprint</Text>
        </View>
        <Switch value={biometricEnabled} onValueChange={() => setBiometricEnabled(!biometricEnabled)} />
      </View>

      <View style={styles.option}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="visibility" size={24} color="black" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>Show Wallet Balance</Text>
          <Text style={styles.optionSubtitle}>Hide or show wallet balance</Text>
        </View>
        <Switch value={walletBalanceVisible} onValueChange={() => setWalletBalanceVisible(!walletBalanceVisible)} />
      </View>

    </View>
  );
};

export default index;

const styles = StyleSheet.create({

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
