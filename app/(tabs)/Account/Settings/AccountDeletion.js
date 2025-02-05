import { View, Text, StatusBar, StyleSheet, TextInput, TouchableOpacity, Switch } from 'react-native'
import React, { useState } from 'react'
import { getStatusBarHeight } from 'react-native-status-bar-height'
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const AccountDeletion = () => {

    const router = useRouter();
    const [deactivate, setDeactivate] = useState(false);
    const [reason, setReason] = useState("");
  return (
    <View style={{paddingTop:getStatusBarHeight(),backgroundColor:'#fff',flex:1,   padding: 20,}}>
    <StatusBar
translucent
barStyle="dark-content"
backgroundColor="rgba(255, 255, 255, 0)" // Transparent white color
/>

{/* Header */}

<View style={styles.header}>
 <TouchableOpacity onPress={() => router.back()}>
   <Ionicons name="arrow-back" size={24} color="black" />
 </TouchableOpacity>
 <Text style={styles.headerText}>Account Settings</Text>
</View>


<View style={styles.option}>
        <View style={styles.iconContainer}>
          <Ionicons name="settings-sharp" size={24} color="black" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.optionTitle}>Deactivate Account</Text>
          <Text style={styles.optionSubtitle}>Deactivate your Account</Text>
        </View>
        <Switch value={deactivate} onValueChange={() => setDeactivate(!deactivate)} />
      </View>

        <TextInput 
        style={{ borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 5,
             marginTop: 5 ,width:'94%',alignSelf:'center',height:250}}
        placeholder="Reason for Deactivation"
        keyboardType="ascii-capable"
        value={reason}
        onChangeText={setReason}
        />

    <TouchableOpacity onPress={{}} style={{ padding: 15, backgroundColor: "#7734eb", borderRadius: 5, marginTop: 20 ,width:'96%',alignSelf:'center'}}>
        <Text style={{ color: "white", textAlign: "center" }}>Submit</Text>
      </TouchableOpacity>

    </View>
  )
}

export default AccountDeletion


const styles = StyleSheet.create({

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop:20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    marginLeft: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  iconContainer: {
    backgroundColor: "#E0D4D4",
    padding: 10,
    borderRadius: 50,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  optionTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  optionSubtitle: {
    color: "#7A7A7A",
    fontSize: 12,
  },
});
