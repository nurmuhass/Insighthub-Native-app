import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Fontisto, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { StatusBar } from "react-native";

const index = () => {
  const router = useRouter();

  const fundingOptions = [
    {
      title: "Automatic Funding",
      subtitle: "Send money through the displayed account and it will automatically appear in your wallet",
      icon: "wallet",
      route: "/Dashboard/FundWallet/Automatic",
    },
    {
      title: "Manual Funding",
      subtitle: "Send money through the displayed account and send message to fund your wallet",
      icon: "wallet",
      route: "/Dashboard/FundWallet/Manual",
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
        <Text style={styles.headerText}>Funding wallet</Text>
      </View>

      {/* Settings Options */}
      {fundingOptions.map((item, index) => (
        <TouchableOpacity key={index} style={styles.option} onPress={() => router.push(item.route)}>
          <View style={styles.iconContainer}>
          <AntDesign name="wallet" size={24} color="black" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.optionTitle}>{item.title}</Text>
            <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
          </View>
          <AntDesign name="arrowright" size={24} color="black" />
        </TouchableOpacity>
      ))}
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
    fontSize: 24,
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
