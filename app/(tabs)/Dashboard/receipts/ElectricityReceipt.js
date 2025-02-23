// receipt.js page
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // For the back icon
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import logo from '../../../../assets/logo.png';


export default function TransactionDetailScreen() {
    const { transaction } = useLocalSearchParams();
    const transactionData = transaction ? JSON.parse(transaction) : null;
    const logoURI = Image.resolveAssetSource(logo).uri;

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
                <span class="value">${transactionData.ref}</span>
              </div>
              <div class="detail-row">
                <span class="label">Status:</span>
                <span class="value status">successful</span>
              </div>
              <div class="detail-row">
                <span class="label">Phone:</span>
                <span class="value">${transactionData.phone}</span>
              </div>
              <div class="detail-row">
                <span class="label">Provider:</span>
                <span class="value">${transactionData.providerName}</span>
              </div>
              <div class="detail-row">
                <span class="label">Description:</span>
                <span class="value">Purchase of Electricity Meter Token</span>
              </div>
            <div class="detail-row">
                <span class="label">Token:</span>
                <span class="value">${transactionData.Token}</span>
            </div>
                 <div class="detail-row">
                <span class="label">Customer:</span>
                <span class="value">${transactionData.Customer_Name}</span>
              </div>
              <div class="detail-row">
                <span class="label">Amount:</span>
                <span class="value">${transactionData.amounttopay}</span>
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
    <View style={{ paddingTop: getStatusBarHeight(), backgroundColor: '#fff', flex: 1 }}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="rgba(255, 255, 255, 0)"
      />
      <ScrollView style={styles.container}>
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
          <Image source={require("../../../../images/electLogo.jpg")} style={styles.providerLogo} />
            <Image source={require("../../../../images/logo.png")} style={styles.providerLogo} />
          </View>
      
        <Text style={styles.summaryText}>
        Dear Customer, You have successfully Purchase Electricity Meter Token Thank you for using Insighthub.
                </Text>
        </View>

        {/* Transaction Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Transaction Information</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Transaction ID:</Text>
            <Text style={styles.detailValue}>{transactionData.ref}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status:</Text>
            <Text style={[styles.detailValue, { color: 'green'  }]}>
              Success
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailValue}>{transactionData.phone}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>provider:</Text>
            <Text style={styles.detailValue}>{transactionData.providerName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description:</Text>
            <Text style={styles.detailValue } numberOfLines={3}>Electricity Meter Token</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Customer:</Text>
            <Text style={styles.detailValue } numberOfLines={3}>Customer_Name</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Token:</Text>
            <Text style={styles.detailValue}>{transactionData.Token}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount:</Text>
            <Text style={styles.detailValue}>{transactionData.amounttopay}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{transactionData.date}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
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