import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TextInput, Image, StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Link, useRouter } from 'expo-router';

const transactionsData = {
  "Buy Data": [
    { id: "1", provider: "MTN SME", amount: "₦129.0", date: "2025-02-01 - 08:23 AM", status: "SUCCESSFUL", details: { phone: "08038148507", product: "MTN SME", description: "500.0MB FOR null", previousBalance: "N1437.82", newBalance: "N1308.82" } },
    { id: "2", provider: "MTN SME", amount: "₦257.0", date: "2025-01-31 - 22:35 PM", status: "SUCCESSFUL", details: { phone: "08038148507", product: "MTN SME", description: "1.0GB FOR null", previousBalance: "N1694.82", newBalance: "N1437.82" } },
  ],
  Airtime: [
    { id: "8", provider: "GLO", amount: "₦500.0", date: "2025-01-28 - 15:12 PM", status: "SUCCESSFUL", details: { phone: "08038148507", product: "GLO", description: "Airtime VTU", previousBalance: "N2194.82", newBalance: "N1694.82" } },
    { id: "9", provider: "AIRTEL", amount: "₦1000.0", date: "2025-01-27 - 10:45 AM", status: "FAILED", details: { phone: "08038148507", product: "AIRTEL", description: "Airtime VTU", previousBalance: "N3194.82", newBalance: "N2194.82" } },
  ],
  Electricity: [
    { id: "10", provider: "IKEDC", amount: "₦3000.0", date: "2025-01-26 - 14:20 PM", status: "SUCCESSFUL", details: { phone: "08038148507", product: "IKEDC", description: "Electricity Bill", previousBalance: "N6194.82", newBalance: "N3194.82" } },
    { id: "11", provider: "EKEDC", amount: "₦2000.0", date: "2025-01-25 - 09:30 AM", status: "PENDING", details: { phone: "08038148507", product: "EKEDC", description: "Electricity Bill", previousBalance: "N8194.82", newBalance: "N6194.82" } },
  ],
  Cable: [
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

export default function TransactionsScreen() {
  const [selectedService, setSelectedService] = useState("Buy Data");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();

  const services = Object.keys(transactionsData);

  const filteredTransactions = transactionsData[selectedService].filter((item) =>
    item.provider.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={{ paddingTop: getStatusBarHeight(), backgroundColor: '#fff', flex: 1 }}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="rgba(255, 255, 255, 0)"
      />
      <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
        {/* Header */}
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={{ fontSize: 20, color: "#2899ff" }}>▼</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginLeft: 10, color: "#2899ff" }}>
            {selectedService} 
          </Text>
        </View>

        {/* Search Bar */}
        <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#eee", padding: 8, borderRadius: 10 }}>
          <TextInput
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            style={{ flex: 1, fontSize: 16 }}
          />
          <Text style={{ fontSize: 20, color: "#888" }}>🔍</Text>
        </View>
     
        {/* Transactions List */}
        <FlatList
          data={filteredTransactions}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Image source={{ uri: "https://via.placeholder.com/100" }} style={{ width: 100, height: 100 }} />
              <Text style={{ marginTop: 10, fontSize: 16, color: "#888" }}>It seems there are no recent activities.</Text>
            </View>
          )}
          renderItem={({ item }) => (   
            <TouchableOpacity onPress={() => router.push({ pathname: "/Transaction/transaction-detail", params: { transaction: JSON.stringify(item) } })}>
              <View style={{ flexDirection: "row", padding: 10, backgroundColor: "#f9f9f9", borderRadius: 5, marginTop: 8 }}>
              {item.provider === 'MTN SME' ? <Image source={require("../../../images/mtn.png")} style={{width:40,height:40,borderRadius:8}}/> 
           : item.provider === 'GLO' ?  <Image source={require("../../../images/glo.jpeg")} style={{width:40,height:40,borderRadius:8}}/> 
            : item.provider === 'AIRTEL' ? <Image source={require("../../../images/airtel.jpeg")} style={{width:40,height:40,borderRadius:8}}/> :''}
        
                <View style={{ marginLeft: 10 }}>
                  <Text style={{ fontWeight: "bold" }}>{item.provider}</Text>
                  <Text>{item.date}</Text>
                </View>
                <Text style={{ marginLeft: "auto", fontWeight: "bold", color: item.status === "SUCCESSFUL" ? "green" : item.status === "FAILED" ? "red" : "orange" }}>
                  {item.amount}
                </Text>
                
              </View>
            </TouchableOpacity>
          )}
        />

        {/* Modal for Service Selection */}
        <Modal animationType="slide" transparent={true} visible={modalVisible} >
          <View style={{ flex: 1, justifyContent: "flex-end", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{  padding: 20,borderTopRightRadius:25,borderTopLeftRadius:25, width: "100%",   alignItems:'bottom', backgroundColor: "white"}}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 ,alignSelf:'center'}}>Select a Service</Text>
              {services.map((service) => (
                <TouchableOpacity key={service} onPress={() => { setSelectedService(service); setModalVisible(false); }}>
                  <Text style={{ fontSize: 16, padding: 10,marginBottomwidth:1,marginBottomcolor:'#eee' }}>{service}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginTop: 10,}}>
                <Text style={{ fontSize: 16, color: "red", textAlign: "center" }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}