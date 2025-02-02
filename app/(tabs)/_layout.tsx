import { Tabs } from "expo-router";
import { Text } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from "expo-status-bar";

const TabsLayout = () => {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:'#2899ff',
        tabBarLabelStyle:{fontWeight:'bold',textTransform:'capitalize'},
        // tabBarIconStyle:{backgroundColor:'#F93C65',color:'#F93C65'},
     
      }}
    >

      <Tabs.Screen
        name="Dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: () => <AntDesign name="home" size={24} color="#2899ff" />,
        }}
    
    />
      <Tabs.Screen
        name="Transaction"
        options={{
          title: "Transaction",
          tabBarIcon: () => <Ionicons name="apps-outline" size={24} color="#2899ff" />,
        }}
      />
      <Tabs.Screen
        name="wallet history"
        options={{
          title: "Wallet History",
          tabBarIcon: () => <MaterialIcons name="add-box" size={24} color="#2899ff" />,
        }}
      />

      <Tabs.Screen
        name="Account"
        options={{
          title: "Account",
          tabBarIcon: () => <AntDesign name="user" size={24} color="#2899ff" />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
