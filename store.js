// store.js
import { Store, registerInDevtools } from "pullstate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Create a Pullstate store to manage auth state
export const AuthStore = new Store({
  isLoggedIn: false,
  initialized: false,
  user: null,
  token: null,
});

// Call this once on app start to check for an existing login flag
export const initializeAuth = async () => {
  try {
    const loggedIn = await AsyncStorage.getItem("loggedIn");
    if (loggedIn === "true") {
      // In a future update, you might also retrieve user info or a token
      AuthStore.update((store) => {
        store.token = null;
        store.user = {}; // you can fill in stored user info if available
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

// Updated signIn function that handles numeric responses
export const signIn = async (phone, password) => {
  try {
    const API_URL = "https://insighthub.com.ng/mobile/home/includes/route.php?login";
    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("password", password);

    const response = await axios.post(API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // Since your API returns numeric responses:
    // 0 = Login successful
    // 1 = Incorrect login details
    // 2 = Account blocked
    if (response.data == 0) {
      // Login successful: persist a simple flag
      await AsyncStorage.setItem("loggedIn", "true");
      // Optionally, store additional user info if available.
      AuthStore.update((store) => {
        store.token = null; // For now, no token is returned.
        store.user = { phone }; // You might store more info later.
        store.isLoggedIn = true;
      });
      return { user: { phone } };
    } else {
      return { error: "Login failed: " + response.data };
    }
  } catch (error) {
    return { error: error.response ? error.response.data : error.message };
  }
};

// Updated signOut function remains the same.
export const signOut = async () => {
  try {
    await AsyncStorage.removeItem("loggedIn");
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");
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
