import { Tabs } from "expo-router";
import { Text } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from "expo-status-bar";
import { useContext } from "react";
import { ThemeContext } from "../../ThemeContext"; 


const TabsLayout = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor:'#7734eb',
        tabBarLabelStyle:{fontWeight:'bold',textTransform:'capitalize'},
        tabBarStyle:{backgroundColor:theme === "dark" ? "#000" : "#fff"},
     
      }}
    >

      <Tabs.Screen
        name="Dashboard"
        options={{
          title: "Dashboard",
          tabBarIcon: () => <AntDesign name="home" size={24} color="#7734eb" />,
        }}
    
    />
      <Tabs.Screen
        name="Transaction"
        options={{
          title: "Transaction",
          tabBarIcon: () => <Ionicons name="apps-outline" size={24} color="#7734eb" />,
        }}
      />
      <Tabs.Screen
        name="wallet history"
        options={{
          title: "Wallet History",
          tabBarIcon: () => <MaterialIcons name="add-box" size={24} color="#7734eb" />,
        }}
      />

      <Tabs.Screen
        name="Account"
        options={{
          title: "Account",
          tabBarIcon: () => <AntDesign name="user" size={24} color="#7734eb" />,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
