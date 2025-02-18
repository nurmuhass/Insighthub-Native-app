import { Store, registerInDevtools } from "pullstate";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthStore = new Store({
  isLoggedIn: false,
  initialized: false,
  user: null,
  token: null,
});

export const initializeAuth = async () => {
  try {
    const loggedIn = await AsyncStorage.getItem("loggedIn");
    if (loggedIn === "true") {
      AuthStore.update((store) => {
        store.token = null;
        store.user = {}; 
        store.isLoggedIn = true;
      });
    } else {
      AuthStore.update((store) => {
        store.token = null;
        store.user = null;
        store.isLoggedIn = false;
      });
    }
  } catch (error) {
    console.error("Error initializing auth:", error);
  } finally {
    AuthStore.update((store) => {
      store.initialized = true;
    });
  }
};

export const signOut = async () => {
  try {
    await AsyncStorage.removeItem("loggedIn");
    await AsyncStorage.removeItem("cookie");
    await AsyncStorage.removeItem("loginId");
    AuthStore.update((store) => {
      store.token = null;
      store.user = null;
      store.isLoggedIn = false;
    });
    return { success: true };
  } catch (error) {
    return { error };
  }
};

registerInDevtools({ AuthStore });
