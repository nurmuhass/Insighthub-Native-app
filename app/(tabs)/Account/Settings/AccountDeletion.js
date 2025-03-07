import { View, Text, StatusBar, StyleSheet, TextInput, TouchableOpacity, Switch, ActivityIndicator, Modal, Alert } from 'react-native'; 
import { useContext, useState, useEffect } from "react";
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from "../../../../ThemeContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from '../../../../store';

const AccountDeletion = () => {
    const router = useRouter();
    const [deactivate, setDeactivate] = useState(false);
    const [reason, setReason] = useState("");
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [userId, setUserId] = useState("0");
    const [loading, setLoading] = useState(false);
    
    // Modal state for confirmation
    const [isModalVisible, setIsModalVisible] = useState(false);

    const API_URL = "https://insighthub.com.ng/api/user/DeleteAccount.php";

    const handleLogout = async () => {
        signOut();
        router.replace("/login");
    };

    useEffect(() => {
        const loadAndFetchProfile = async () => {
            try {
                const token = await AsyncStorage.getItem("token");
                if (!token) {
                    Alert.alert("Error", "No access token found");
                    return;
                }

                const rawApiResponse = await AsyncStorage.getItem("rawApiResponse");
                if (rawApiResponse) {
                    const parsedResponse = JSON.parse(rawApiResponse);
                    setUserId(parsedResponse.sId);
                } else {
                    console.log("rawApiResponse not found in storage.");
                }
            } catch (error) {
                console.error("Error loading profile:", error);
                Alert.alert("Error", "An error occurred while fetching transactions");
            }
        };

        loadAndFetchProfile();
    }, []);

    const handleDeleteUser = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "No access token found");
                return;
            }

            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Token ${token}`,
                },
                body: JSON.stringify({
                    sId: userId,
                }),
            });

            const respJson = await response.json();
            console.log("Delete Account Response:", respJson);

            if (respJson.status === "success") {
                Alert.alert("Success", "Your Account has been deleted Successfully.");
                handleLogout();
            } else {
                Alert.alert("Error", "An error occurred while deleting account.");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            Alert.alert("Error", "An error occurred while deleting account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={[styles.container, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
            <StatusBar translucent barStyle="dark-content" backgroundColor="rgba(255, 255, 255, 0)" />
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={theme === "dark" ? "#fff" : "#000"} />
                </TouchableOpacity>
                <Text style={[styles.headerText, { color: theme === "dark" ? "#fff" : "#000" }]}>Account Settings</Text>
            </View>

            <View style={[styles.option, theme === "dark" ? styles.darkContainer : styles.lightContainer]}>
                <View style={styles.iconContainer}>
                    <Ionicons name="settings-sharp" size={24} color={theme === "dark" ? "#fff" : "#000"} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.optionTitle, { color: theme === "dark" ? "#fff" : "#000" }]}>Deactivate Account</Text>
                    <Text style={[styles.optionSubtitle, { color: theme === "dark" ? "#fff" : "#000" }]}>Deactivate your Account</Text>
                </View>
                <Switch value={deactivate} onValueChange={() => setDeactivate(!deactivate)} />
            </View>


            <TouchableOpacity
                style={{ padding: 15, backgroundColor: "#7734eb", borderRadius: 5, marginTop: 20, width: '96%', alignSelf: 'center' }}
                onPress={() => setIsModalVisible(true)} // Show the modal on button click
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={{ color: "white", textAlign: "center" }}>Delete Account</Text>
                )}
            </TouchableOpacity>

            {/* Modal for confirmation */}
            <Modal
                animationType="slide"
                transparent={true} 
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)} // Close modal if user taps outside
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Are you sure you want to delete your account?</Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "red" }]}
                                onPress={() => setIsModalVisible(false)} // Close modal on No
                            >
                                <Text style={styles.modalButtonText}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: "green" }]}
                                onPress={() => {
                                    handleDeleteUser(); // Proceed with deletion
                                    setIsModalVisible(false); // Close modal after confirmation
                                }}
                            >
                                <Text style={styles.modalButtonText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

export default AccountDeletion;

const styles = StyleSheet.create({
    container: { paddingTop: getStatusBarHeight(), backgroundColor: '#fff', flex: 1, padding: 20 },
    lightContainer: { backgroundColor: "#fff" },
    darkContainer: { backgroundColor: "#121212" },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 20,
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
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 8,
        width: '80%',
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: '100%',
    },
    modalButton: {
        padding: 10,
        borderRadius: 5,
        width: '40%',
        alignItems: "center",
    },
    modalButtonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
