import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import Dashboard from './src/screens/Dashboard';
import RaiseTicket from './src/screens/RaiseTicket';
import QRScannerScreen from './src/screens/QRScannerScreen';

export default function App() {
    const [user, setUser] = useState(null);
    const [screen, setScreen] = useState('Login'); // 'Login' | 'Dashboard' | 'RaiseTicket' | 'QRScanner'

    const handleLogin = (userData) => {
        setUser(userData);
        setScreen('Dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        setScreen('Login');
    };

    const handleGoRaiseTicket = () => {
        setScreen('RaiseTicket');
    };

    const handleGoScanQR = () => {
        setScreen('QRScanner');
    };

    const handleTicketSuccess = () => {
        setScreen('Dashboard');
    };

    const handleBack = () => {
        setScreen('Dashboard');
    };

    return (
        <View style={styles.root}>
            {screen === 'Login' && (
                <LoginScreen onLogin={handleLogin} />
            )}
            {screen === 'Dashboard' && user && (
                <Dashboard
                    user={user}
                    onLogout={handleLogout}
                    onRaiseTicket={handleGoRaiseTicket}
                    onScanQR={handleGoScanQR}
                />
            )}
            {screen === 'RaiseTicket' && user && (
                <RaiseTicket
                    user={user}
                    onBack={handleBack}
                    onSuccess={handleTicketSuccess}
                />
            )}
            {screen === 'QRScanner' && (
                <QRScannerScreen
                    onBack={handleBack}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
});
