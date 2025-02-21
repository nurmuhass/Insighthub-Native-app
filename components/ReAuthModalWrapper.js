// ReAuthModalWrapper.js
import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import ReAuthModal from './ReAuthModal'; // Adjust path as needed

const ReAuthModalWrapper = ({ visible, onSuccess, onRequestClose }) => {
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <ReAuthModal onUnlock={onSuccess} />
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
