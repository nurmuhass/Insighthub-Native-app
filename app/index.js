import React, { useEffect, useState } from "react";
import { View, Image, AppState } from "react-native";
import { useRouter, useSegments } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LockScreen from "./(auth)/LockScreen";

const Index = () => {
  const segments = useSegments();
  const router = useRouter();
  const [initialized, setInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loggedIn = await AsyncStorage.getItem("loggedIn");
        const rawData = await AsyncStorage.getItem("rawApiResponse");
        console.log("AsyncStorage loggedIn:", loggedIn);
        console.log("rawApiResponse:", rawData);
        if (loggedIn === "true" && rawData) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error reading login status", error);
      } finally {
        setInitialized(true);
      }
    };
    checkLoginStatus();
  }, []);
  

  // Listen for app state changes to re-lock on resume.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (nextAppState === "active") {
        // When coming to foreground, assume the app should lock.
        setIsUnlocked(false);
        console.log("AppState changed to active: locking app");
      }
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!initialized) return;

    // Log the segments and our states for debugging.
    console.log("Segments:", segments);
    console.log("isLoggedIn:", isLoggedIn, "isUnlocked:", isUnlocked);

    const inAuthGroup = segments[0] === "(auth)";
    if (!isLoggedIn && !inAuthGroup) {
      // If not logged in, route to login.
      console.log("User not logged in - routing to login");
      router.replace("/(auth)/login");
    } else if (isLoggedIn) {
      // If logged in, check unlock state.
      if (!isUnlocked) {
        console.log("User logged in but not unlocked - routing to LockScreen");
        router.replace("/(auth)/LockScreen");
      } else {
        console.log("User logged in and unlocked - routing to Dashboard");
        router.replace("/(tabs)/Dashboard");
      }
    }
  }, [segments, initialized, isLoggedIn, isUnlocked, router]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {!initialized && (
        <Image
          source={require("../assets/images/splash.png")}
          style={{ height: "100%", width: "100%" }}
        />
      )}
    </View>
  );
};

export default Index;
