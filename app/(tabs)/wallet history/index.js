import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { ThemeContext } from "../../../ThemeContext"; 

const WalletHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
   const [transactions, setTransactions] = useState([]);
    const [sId, setSId] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [selectedService, setSelectedService] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
      const { theme, toggleTheme } = useContext(ThemeContext);

  const dummytransactions = [
    {
      date: '2025-01-27 – 05:23 AM',
      description: 'MTN 1.0GB N257.0 DATA topup with 08136943026',
      previousBalance: 'N6403.90',
      amount: 'N257.0',
      newBalance: 'N5632.90',
    },
    {
      date: '2025-01-26 – 20:50 PM',
      description: 'GLO 500 Airtime VTU topup with 09057201043',
      previousBalance: 'N6893.90',
      amount: 'N490.0',
      newBalance: 'N6403.90',
    },
    {
      date: '2025-01-26 – 11:46 AM',
      description: 'MTN 1.0GB N257.0 DATA topup with 09036496865',
      previousBalance: 'N7150.90',
      amount: 'N257.0',
      newBalance: 'N6893.90',
    },
    {
      date: '2025-01-26 – 08:25 AM',
      description: 'GLO 500 Airtime VTU topup with 09057201043',
      previousBalance: 'N7640.90',
      amount: 'N490.0',
      newBalance: 'N7150.90',
    },
    {
      date: '2025-01-25 – 14:24 PM',
      description: 'AIRTEL 1.5GB N500.0 DATA topup with 08123456789',
      previousBalance: 'N8140.90',
      amount: 'N500.0',
      newBalance: 'N7640.90',
    },
    {
      date: '2025-01-25 – 10:15 AM',
      description: 'MTN 2.0GB N500.0 DATA topup with 08098765432',
      previousBalance: 'N8640.90',
      amount: 'N500.0',
      newBalance: 'N8140.90',
    },
    {
      date: '2025-01-24 – 18:30 PM',
      description: 'GLO 1.0GB N300.0 DATA topup with 09057201043',
      previousBalance: 'N8940.90',
      amount: 'N300.0',
      newBalance: 'N8640.90',
    },
    {
      date: '2025-01-24 – 09:00 AM',
      description: 'AIRTEL 500MB N200.0 DATA topup with 08123456789',
      previousBalance: 'N9140.90',
      amount: 'N200.0',
      newBalance: 'N8940.90',
    },
  ];

  const filteredTransactions = transactions.filter(transaction =>
    transaction.servicedesc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const loadAndFetchTransactions = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          Alert.alert("Error", "No access token found");
          return;
        }
        
        // Retrieve user ID from rawApiResponse
        const rawApiResponse = await AsyncStorage.getItem("rawApiResponse");
        let userId = null;
        if (rawApiResponse) {
          const parsedResponse = JSON.parse(rawApiResponse);
          userId = parsedResponse.sId;
          setSId(userId);
        } else {
          console.log("rawApiResponse not found in storage; sId remains null");
        }
        
        if (userId) {
          const url = `https://insighthub.com.ng/api/user/GetTransactions.php?userId=${userId}&limit=100&filter=airtime_data
`;
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
            // Extract unique service names from transactions
            const services = [...new Set((json.transactions || []).map(tx => tx.servicename))];
            // Set default selected service as the first one (if available)
            if (services.length > 0) {
              setSelectedService(services[0]);
            }
          } else {
            Alert.alert("Error", json.msg || "Failed to load transactions");
          }
        }
      } catch (error) {
        console.error("Error loading sId and fetching transactions:", error);
        Alert.alert("Error", "An error occurred while fetching transactions");
      }
    };

    loadAndFetchTransactions();
  }, []);

  return (
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
 <StatusBar translucent barStyle={theme === "dark" ? "light-content" 
   : "dark-content"} backgroundColor="transparent" />
     <Text style={{fontSize:20,marginLeft:10,fontWeight:'bold',alignSelf:'center',padding:10,color: theme === "dark" ? "#fff" : "#000"}}>Wallet History</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search transactions..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView>
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
    paddingTop:getStatusBarHeight(),flex:1
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