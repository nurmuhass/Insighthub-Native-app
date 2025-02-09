import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { useRouter, useSegments } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = () => {
  const segments = useSegments();
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem("loggedIn");
        if (loggedIn === "true") {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error reading login status", error);
      } finally {
        setInitialized(true);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === "(auth)";
    if (!isLoggedIn && !inAuthGroup) {
      // If not logged in, redirect to login screen.
      router.replace("/(auth)/login");
    } else if (isLoggedIn) {
      // If logged in, redirect to the home screen.
      router.replace("/(tabs)/Dashboard");
    }
  }, [segments, initialized, isLoggedIn, router]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {!initialized ? (
        <Image
          source={require("../assets/images/splash.png")}
          style={{ height: "100%", width: "100%" }}
        />
      ) : null}
    </View>
  );
};

export default Index;
