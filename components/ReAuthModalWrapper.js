// ReAuthModalWrapper.js
import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import ReAuthModal from './ReAuthModal'; // Adjust path as needed

const ReAuthModalWrapper = ({ visible, onSuccess, onCancel,combinedData }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onCancel} // use onCancel here
    >
      <View style={styles.modalContainer}>
        <ReAuthModal onUnlock={onSuccess} onCancel={onCancel} combinedData={combinedData}/>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default ReAuthModalWrapper;
