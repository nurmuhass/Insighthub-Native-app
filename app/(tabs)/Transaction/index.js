import React, { useContext, useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Image, 
  StatusBar, 
  StyleSheet, 
  Alert, 
  RefreshControl 
} from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from "../../../ThemeContext"; 
import { ActivityIndicator } from 'react-native';

const TransactionsScreen = () => {
  const router = useRouter();
  
  // State variables
  const [transactions, setTransactions] = useState([]);
  const [sId, setSId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // New state for pull-to-refresh

  // Dummy transactions data for fallback
  const DummytransactionsData = {
    "Buy Data": [
    ],
    "Airtime": [
      ],
    "Electricity": [
      ],
    "Cable": [
    ],
    'Education Pin': [
    ],
    'Bulk SMS': [
    ],
    'Recharge Card': [
    ],
    'Airime Swap': [
    ],
  };

  // Fetch real-time transactions on mount
  const loadAndFetchTransactions = async () => {
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
      } else {
        console.log("rawApiResponse not found in storage; sId remains null");
      }
      
      if (userId) {
        const url = `https://insighthub.com.ng/api/user/GetTransactions.php?userId=${userId}&limit=200`;
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
          
          const services = [...new Set((json.transactions || []).map(tx => tx.servicename))];
          if (services.length > 0) {
            setSelectedService(services[0]);
          }
        } else {
          Alert.alert("Error", json.msg || "Failed to load transactions");
        }
      }
    } catch (error) {
      console.error("Error loading sId and fetching transactions:", error);
      setLoading(false);
      Alert.alert("Error", "An error occurred while fetching transactions. Check your network and try again.");
    }
  };

  // Call loadAndFetchTransactions on component mount
  useEffect(() => {
    loadAndFetchTransactions();
  }, []);

  // Pull-to-refresh logic
  const onRefresh = async () => {
    setRefreshing(true);
    await loadAndFetchTransactions();  // Re-fetch data
    setRefreshing(false);
  };

  // Filter transactions based on search text and selected service
  const filteredTransactions = transactions.filter(item => {
    const serviceMatch = selectedService ? (item.servicename === selectedService) : true;
    const searchMatch = item.servicedesc.toLowerCase().includes(searchText.toLowerCase());
    return serviceMatch && searchMatch;
  });

  const serviceOptions = transactions.length > 0 
    ? [...new Set(transactions.map(item => item.servicename))] 
    : Object.keys(DummytransactionsData);

  if (loading) {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor: theme === "dark" ? "#000" : "#fff"}}>
        <ActivityIndicator size="large" color="#7734eb" />
      </View>
    );
  }

  return (
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
<StatusBar translucent barStyle={theme === "dark" ? "light-content" 
  : "dark-content"} backgroundColor="transparent" />
      <View style={{ padding: 10,}}>
        {/* Header with Service Selection */}
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={[styles.dropdownIcon, { color: theme === "dark" ? "#fff" : "#2899ff" }]}>▼</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme === "dark" ? "#fff" : "#2899ff" }]}>{selectedService}</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
          <Text style={styles.searchIcon}>🔍</Text>
        </View>

   {/* Transactions List */}
   <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.transref}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Image source={{ uri: "https://via.placeholder.com/100" }} style={{ width: 100, height: 100 }} />
              <Text style={{ marginTop: 10, fontSize: 16, color: "#888" }}>No transactions found.</Text>
            </View> 
          )}
          renderItem={({ item }) => (
<TouchableOpacity
  onPress={() => {
    if (["Airtime", "Data"].includes(item.servicename)) {
      router.push({
        pathname: "/Transaction/transaction-detail",
        params: { transaction: JSON.stringify(item) }
      });
    } else {
      // Optionally, you can do nothing or show an alert/message.
      
    }
  }}
>
       <View style={{ flexDirection: "row", padding: 10, backgroundColor: theme === "dark" ? "#000" : "#fff" , borderRadius: 5, marginTop: 8 }}>
              { item.servicedesc && item.servicedesc.toUpperCase().includes('AIRTEL') && (
  <Image source={require("../../../images/airtel.jpeg")} style={styles.providerLogo} />
)}
{ item.servicedesc && item.servicedesc.toUpperCase().includes('MTN') && (
  <Image source={require("../../../images/mtn.png")} style={styles.providerLogo} />
)}
{ item.servicedesc && item.servicedesc.toUpperCase().includes('GLO') && (
  <Image source={require("../../../images/glo.jpeg")} style={styles.providerLogo} />
)}
{ item.servicedesc && item.servicedesc.toUpperCase().includes('9MOBILE') && (
  <Image source={require("../../../images/9mobile.png")} style={styles.providerLogo} />
)}
{ item.servicename === 'Electricity Bill' ?
  <Image source={require("../../../images/electLogo.jpg")} style={styles.providerLogo} /> :
  ''
}

                <View style={{ marginLeft: 10 }}>
    <Text style={{ fontWeight: "bold",alignSelf:'flex-start',color: theme === "dark" ? "#fff" : "#000" }}> { item.servicedesc && item.servicedesc.toUpperCase().includes('AIRTEL') && (
'Airtel'
)}
{ item.servicedesc && item.servicedesc.toUpperCase().includes('MTN') && (
'MTN'
)}
{ item.servicedesc && item.servicedesc.toUpperCase().includes('GLO') && (
'Glo'
)}
{ item.servicedesc && item.servicedesc.toUpperCase().includes('9MOBILE') && (
'9Mobile'
)}
{ item.servicename === 'Electricity Bill' ?  
'Electricity Bill' : item.servicename === 'Wallet Credit' ? 'Wallet Credit' : ''
}
</Text>
                  <Text style={{color: theme === "dark" ? "#fff" : "#000"}}>{item.date}</Text>
                </View>
                <Text style={{ marginLeft: "auto", fontWeight: "bold", color: item.status === "0" ? "green" : item.status === "1" ? "red" : "orange" }}>
                ₦{item.amount}
                </Text>
                
              </View>
            </TouchableOpacity>
          )}
        />


        {/* Modal for Service Selection */}
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Select a Service</Text>
              {serviceOptions.map((service) => (
                <TouchableOpacity key={service} onPress={() => { setSelectedService(service); setModalVisible(false); }}>
                  <Text style={styles.modalItem}>{service}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingTop: getStatusBarHeight(),  flex: 1  },
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  headerContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  dropdownIcon: { fontSize: 20, color: "#2899ff" },
  headerTitle: { fontSize: 20, fontWeight: "bold", marginLeft: 10, color: "#2899ff" },
  searchContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#eee", padding: 8, borderRadius: 10 },
  searchInput: { flex: 1, fontSize: 16 },
  searchIcon: { fontSize: 20, color: "#888" },
  transactionItem: { flexDirection: "row", padding: 10, backgroundColor: "#f9f9f9", borderRadius: 5, marginTop: 8, alignItems: "center" },
  providerLogo: { width: 40, height: 40, borderRadius: 8 },
  transactionInfo: { marginLeft: 10 },
  transactionProvider: { fontWeight: "bold" },
  transactionDate: { color: "#666" },
  transactionAmount: { marginLeft: "auto", fontWeight: "bold" },
  modalOverlay: { flex: 1, justifyContent: "flex-end", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { padding: 20, borderTopRightRadius: 25, borderTopLeftRadius: 25, width: "100%", backgroundColor: "white" },
  modalHeader: { fontSize: 18, fontWeight: "bold", marginBottom: 10, alignSelf: "center" },
  modalItem: { fontSize: 16, padding: 10, borderBottomWidth: 1, borderBottomColor: "#eee" },
  modalCloseButton: { marginTop: 10, padding: 10, alignSelf: "center" },
  modalCloseText: { fontSize: 16, color: "red" },
});

export default TransactionsScreen;
