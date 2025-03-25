// receipt.js page
import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // For the back icon
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import logo from '../../../assets/logo.png';
import { ThemeContext } from '../../../ThemeContext';


export default function ElectricityDetailScreen() {
    const { transaction } = useLocalSearchParams();
    const transactionData = transaction ? JSON.parse(transaction) : null;
    const logoURI = Image.resolveAssetSource(logo).uri;
    const { theme, toggleTheme } = useContext(ThemeContext);
    const router = useRouter();
console.log(transactionData)
  // Function to generate PDF and share it
  const handleShare = async () => {
    try {
      // Create HTML content for the PDF
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .header img { width: 100px; height: auto; }
              .header h1 { color: #2899ff; margin: 10px 0; }
              .details { border: 1px solid #eee; padding: 20px; border-radius: 10px; }
              .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
              .label { font-weight: bold; color: #666; }
              .value { color: #333; }
              .status { color: green; font-weight: bold; }
              .footer { text-align: center; margin-top: 20px; color: #888; }
            </style>
          </head>
          <body>
            <div class="header">
             
              <img src="${logoURI}" alt="Logo" />
              <h1>Transaction Receipt</h1>
            </div>
            <div class="details">
              <div class="detail-row">
                <span class="label">Transaction ID:</span>
                <span class="value">${transactionData.orderId}</span>
              </div>
              <div class="detail-row">
                <span class="label">Status:</span>
               <span class="value status">${transactionData.status === '0' ? 'Success' : 'Failed'}</span>
              </div>
      
         <div class="detail-row">
                <span class="label">Description:</span>
                <span class="value">Purchase of Electricity Meter Token</span>
              </div>

            <div class="detail-row">
                <span class="label">Customer:</span>
                <span class="value">${transactionData.customerName}</span>
              </div>

              <div class="detail-row">
                <span class="label">Address:</span>
                <span class="value">${transactionData.customerAddress}</span>
              </div>
     
            <div class="detail-row">
                <span class="label">Token:</span>
                <span class="value">${transactionData.unitToken}</span>
            </div>
        
              <div class="detail-row">
                <span class="label">Amount:</span>
                <span class="value">${transactionData.amount}</span>
              </div>
              <div class="detail-row">
                <span class="label">Date:</span>
                <span class="value">${transactionData.date}</span>
              </div>
              
            </div>
            <div class="footer">
              <p>Thank you for using our service!</p>
              <p>Insighthub.com.ng</p>
            </div>
          </body>
        </html>
      `;

      // Generate PDF from HTML content
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Share the PDF file
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', dialogTitle: 'Share Transaction Receipt' });
    } catch (error) {
      console.error('Error generating or sharing PDF:', error);
    }
  };

  return (
    <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="rgba(255, 255, 255, 0)"
      />
      <ScrollView style={{flex: 1,
    backgroundColor:theme === "dark" ? styles.darkContainer : styles.lightContainer}}>
        {/* Header with Back Button */}
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Transaction Details</Text>
          </View>

          {/* Share Button */}
          <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction Summary */}
        <View style={styles.summaryContainer}>
          <View style={styles.providerLogoContainer}>
          <Image source={require("../../../images/electLogo.jpg")} style={styles.providerLogo} />
            <Image source={require("../../../images/logo.png")} style={styles.providerLogo} />
          </View>
      
        <Text style={styles.summaryText}>
        Dear Customer, You have successfully Purchase Electricity Meter Token Thank you for using Insighthub.
                </Text>
        </View>

        {/* Transaction Details */}
        <View style={[styles.summaryContainer, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
          <Text style={[styles.sectionTitle, { color: theme === "dark" ? "#fff" : "#000" }]}>Transaction Information</Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme === "dark" ? "#fff" : "#000" }]}>Transaction ID:</Text>
            <Text style={[styles.detailValue, { color: theme === "dark" ? "#fff" : "#000" }]}>{transactionData.orderId}</Text>
          </View>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme === "dark" ? "#fff" : "#000" }]}>Status:</Text>
                <Text style={[styles.detailValue, { color: transactionData.status === '0' ? 'green' : 'red' }]}>
                  {transactionData.status === '0' ? 'Success' : 'Failed'}
                </Text>
              </View>

          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme === "dark" ? "#fff" : "#000" }]}>Description:</Text>
            <Text style={{width:'70%',marginLeft:25,marginRight:5,color: theme === "dark" ? "#fff" : "#000" }} numberOfLines={4}>{transactionData.servicedesc} </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme === "dark" ? "#fff" : "#000" }]}>Customer:</Text>
            <Text style={[styles.detailValue , { color: theme === "dark" ? "#fff" : "#000" }]}numberOfLines={3}>{transactionData.customerName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme === "dark" ? "#fff" : "#000" }]}>Token:</Text>
            <Text style={[styles.detailValue, { color: theme === "dark" ? "#fff" : "#000" }]}>{transactionData.unitToken}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme === "dark" ? "#fff" : "#000" }]}>Amount:</Text>
            <Text style={[styles.detailValue, { color: theme === "dark" ? "#fff" : "#000" }]}>N{transactionData.amount}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: theme === "dark" ? "#fff" : "#000" }]}>Date:</Text>
            <Text style={[styles.detailValue, { color: theme === "dark" ? "#fff" : "#000" }]}>{transactionData.date}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {

    paddingTop: getStatusBarHeight(), backgroundColor: '#fff', flex: 1 
  },
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  shareButton: {
    padding: 7,
    backgroundColor: '#2899ff',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 35,
  },
  shareButtonText: {
    color: '#fff',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#eee',
    width: '96%',
    alignSelf: 'center',
    borderRadius: 10,
  },
  providerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  providerLogo: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    alignSelf: 'center',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 8,
  },
  detailLabel: {
    fontSize: 16,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});