import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar,Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { useRouter } from "expo-router";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { TextInput } from "react-native";

const CampaignScreen = () => (
  <View style={styles.tabContainer}>
    <View style={styles.bonusCard}>
      <Text style={styles.bonusText}>Referral Bonus</Text>
      <Text style={styles.amount}>₦322.0</Text>
    </View>
    <TouchableOpacity style={styles.moveBonusButton}>
      <Text style={styles.moveBonusText}>Move Bonus to Wallet</Text>
    </TouchableOpacity>

    <ScrollView contentContainerStyle={styles.optionsContainer} showsVerticalScrollIndicator={false}>
<Image source={require("../../../../images/freinds.png")} style={{    width: 250,
    height: 150,
    resizeMode: "contain",
    marginVertical: 20,
    alignSelf:'center'}} />

    <Text style={styles.inviteText}>Invite your friends and receive bonus on their transactions</Text>
    <Text style={styles.inviteDescription}>
      Invite your friends to join and unlock exciting rewards! Simply share your referral code.
    </Text>
    <Text style={styles.referralLabel}>Your unique referral code</Text>
    <View style={styles.referralBox}>
      <Text style={styles.referralCode}>NurMuhass</Text>

      <TouchableOpacity style={styles.copyButton}>
        <Ionicons name="copy-outline" size={20} color="#fff" />
        <Text style={styles.copyText}>Copy referral code</Text>
      </TouchableOpacity>
    </View>
    <TouchableOpacity style={styles.referButton}>
      <Text style={styles.referButtonText}>Refer a friend</Text>
    </TouchableOpacity>
    </ScrollView>

  </View>
);

const ReferralsScreen = () => {
  const referredUsers = ["John Doe", "Jane Smith", "Aliyu Musa", "Grace Obi"];
  return (
    <View style={styles.tabContainer}>
      <FlatList
        data={referredUsers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userName}>{item}</Text>
          </View>
        )}
      />
    </View>
  );
};

const ReferralScreen = () => {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "campaign", title: "Campaign" },
    { key: "referrals", title: "Referrals" },
  ]);

  const referralCode = "EmBello";



  const renderScene = SceneMap({
    campaign: CampaignScreen,
    referrals: ReferralsScreen,
  });

  return (
      <View style={{paddingTop:getStatusBarHeight(),backgroundColor:'#fff',flex:1}}>
          <StatusBar
    translucent
    barStyle="dark-content"
    backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
  />
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#7734eb" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Referral</Text>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: "#7734eb" }}
            style={{ backgroundColor: "#f1f1f1",color:"#7734eb" }}
            labelStyle={{ color: "#7734eb", fontWeight: "bold" }}
            t
          />
        )}
      />
    </View>
  );
};

export default ReferralScreen;

const styles = StyleSheet.create({
  backButton: {
    margin: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    alignSelf: "center",
    marginBottom: 10,
  },
  tabContainer: {
    flex: 1,
    padding: 20,
  },
  bonusCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 10,
  },
  bonusText: {
    fontSize: 16,
    color: "#333",
  },
  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  moveBonusButton: {
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#7734eb",
    alignItems: "center",
  },
  moveBonusText: {
    color: "#7734eb",
    fontSize: 16,
  },
  inviteText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  inviteDescription: {
    fontSize: 14,
    textAlign: "center",
    marginVertical: 10,
    color: "#777",
  },
  referralLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
  },
  referralBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#7734eb",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  referralCode: {
    fontSize: 16,
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#7734eb",
    padding: 5,
    borderRadius: 5,
  },
  copyText: {
    color: "#fff",
    marginLeft: 5,
  },
  referButton: {
    backgroundColor: "#7734eb",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: "center",
  },
  referButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  userCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  userName: {
    fontSize: 16,
    color: "#333",
  },
});
