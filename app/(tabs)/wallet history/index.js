import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  StatusBar, 
  ActivityIndicator, 
  Alert, 
  RefreshControl 
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { ThemeContext } from "../../../ThemeContext";

const WalletHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [sId, setSId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);  // Track if the list is refreshing
  const { theme } = useContext(ThemeContext);

  const filteredTransactions = transactions.filter(transaction =>
    transaction.servicedesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Function to fetch transactions from API
  const fetchTransactions = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "No access token found");
        return;
      }

      const rawApiResponse = await AsyncStorage.getItem("rawApiResponse");
      let userId = null;
      if (rawApiResponse) {
        const parsedResponse = JSON.parse(rawApiResponse);
        userId = parsedResponse.sId;
        setSId(userId);
      }

      if (userId) {
        const url = `https://insighthub.com.ng/api/user/GetTransactions.php?userId=${userId}&limit=100&filter=airtime_data`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Authorization": `Token ${token}`
          }
        });

        const responseText = await response.text();
        let json;
        try {
          json = JSON.parse(responseText);
        } catch (e) {
          console.error("Error parsing JSON:", e);
          return;
        }

        if (json.status === "success") {
          setTransactions(json.transactions || []);
          setLoading(false);
        } else {
          Alert.alert("Error", json.msg || "Failed to load transactions");
        }
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
      setLoading(false);
      Alert.alert("Error", "An error occurred while fetching transactions.");
    }
  };

  // Fetch transactions initially and set up polling
  useEffect(() => {
    fetchTransactions();

    const interval = setInterval(() => {
      fetchTransactions();  // Poll every 30 seconds for new data
    }, 30000); // Adjust the interval as needed

    return () => clearInterval(interval);  // Cleanup the interval on component unmount
  }, []);

  // Function to handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchTransactions().finally(() => setRefreshing(false));  // Re-fetch data and stop refreshing animation
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme === "dark" ? "#000" : "#fff" }}>
        <ActivityIndicator size="large" color="#7734eb" />
      </View>
    );
  }

  return (
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <StatusBar translucent barStyle={theme === "dark" ? "light-content" : "dark-content"} backgroundColor="transparent" />
      <Text style={{ fontSize: 20, marginLeft: 10, fontWeight: 'bold', alignSelf: 'center', padding: 10, color: theme === "dark" ? "#fff" : "#000" }}>
        Wallet History
      </Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search transactions..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {filteredTransactions.map((transaction, index) => (
          <View key={index} style={[styles.transaction, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
            <Text style={[styles.date, { color: theme === "dark" ? "#fff" : "#000" }]}>{transaction.date}</Text>
            <Text style={[styles.description, { color: theme === "dark" ? "#fff" : "#000" }]}>{transaction.servicedesc}</Text>
            <View style={[styles.balanceContainer, { color: theme === "dark" ? "#fff" : "#000" }]}>
              <Text style={[styles.balanceLabel, { color: theme === "dark" ? "#fff" : "#000" }]}>Prev Balance:</Text>
              <Text style={[styles.balanceValue, { color: theme === "dark" ? "#fff" : "#000" }]}> ₦{transaction.oldbal}</Text>
            </View>
            <Text style={styles.amount}> ₦{transaction.amount}</Text>
            <View style={[styles.balanceContainer, { color: theme === "dark" ? "#fff" : "#000" }]}>
              <Text style={[styles.balanceLabel, { color: theme === "dark" ? "#fff" : "#000" }]}>New Balance:</Text>
              <Text style={[styles.balanceValue, { color: theme === "dark" ? "#fff" : "#000" }]}> ₦{transaction.newbal}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: getStatusBarHeight(),
    flex: 1
  },
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
    backgroundColor: '#fff',
    width: '94%',
    marginHorizontal: '3%',
  },
  transaction: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
  },
  balanceValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 8,
  },
});

export default WalletHistory;
