import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StatusBar } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";

const index = () => {
  const router = useRouter();
  const [pnotification, setPotification] = useState(false);
  const [enotification, setEnotification] = useState(false);

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
        <Text style={styles.headerText}>Notifications Settings</Text>
      </View>

    {/* Toggle Switches */}
      <View style={styles.option}>
        <View style={styles.iconContainer}>
          <Ionicons name="notifications" size={24} color="black" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>Push Notification</Text>
          <Text style={styles.optionSubtitle}>Enable/Disable Push 
            Notifications</Text>
        </View>
        <Switch value={pnotification} onValueChange={() => setPotification(!pnotification)} />
      </View>

      <View style={styles.option}>
        <View style={styles.iconContainer}>
        <MaterialIcons name="email" size={24} color="black" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>Email Notification</Text>
          <Text style={styles.optionSubtitle}>Enable/Disable Email
          Notifications</Text>
        </View>
        <Switch value={enotification} onValueChange={() => setEnotification(!enotification)} />
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
