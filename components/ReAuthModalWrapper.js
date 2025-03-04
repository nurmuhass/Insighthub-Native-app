// ReAuthModalWrapper.js
import React, { useContext } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import ReAuthModal from './ReAuthModal'; // Adjust path as needed
import { ThemeContext } from "../ThemeContext"; 
import { getStatusBarHeight } from "react-native-status-bar-height";

const ReAuthModalWrapper = ({ visible, onSuccess, onCancel,combinedData }) => {
    const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onCancel} // use onCancel here
    >
      <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
        <ReAuthModal onUnlock={onSuccess} onCancel={onCancel} combinedData={combinedData}/>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   backgroundColor: "red",
    paddingTop: getStatusBarHeight(),
  },
  lightContainer: { backgroundColor: "#fff" },
  darkContainer: { backgroundColor: "#121212" },
});

export default ReAuthModalWrapper;
