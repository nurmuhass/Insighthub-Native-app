import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const WalletHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const transactions = [
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
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{paddingTop:getStatusBarHeight(),backgroundColor:'#fff',flex:1}}>
             <StatusBar
       translucent
       barStyle="dark-content"
       backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
     />
     <Text style={{fontSize:20,marginLeft:10,fontWeight:'bold',alignSelf:'center',padding:10}}>Wallet History</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search transactions..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <ScrollView>
        {filteredTransactions.map((transaction, index) => (
          <View key={index} style={styles.transaction}>
            <Text style={styles.date}>{transaction.date}</Text>
            <Text style={styles.description}>{transaction.description}</Text>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>Prev Balance:</Text>
              <Text style={styles.balanceValue}>{transaction.previousBalance}</Text>
            </View>
            <Text style={styles.amount}>{transaction.amount}</Text>
            <View style={styles.balanceContainer}>
              <Text style={styles.balanceLabel}>New Balance:</Text>
              <Text style={styles.balanceValue}>{transaction.newBalance}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
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
    backgroundColor: '#fff',
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