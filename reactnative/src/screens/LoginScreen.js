import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import client from '../api/client';

export default function LoginScreen({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password.');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const response = await client.post('/auth/login', { email: email.trim(), password });
            onLogin(response.data);
        } catch (err) {
            const msg = err.response?.data?.message || 'Login failed. Check your connection.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoIcon}>🛡️</Text>
                    </View>
                    <Text style={styles.appTitle}>Ticket System</Text>
                    <Text style={styles.appSubtitle}>Sign in to manage your requests</Text>
                </View>

                <View style={styles.card}>
                    <CustomInput
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="name@example.com"
                        keyboardType="email-address"
                        icon="📧"
                    />
                    <CustomInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        placeholder="••••••••"
                        secureTextEntry
                        icon="🔒"
                    />

                    {!!error && (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>⚠️  {error}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.loginBtnText}>Sign In  →</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.credentialsHint}>
                        <Text style={styles.hintTitle}>Demo Credentials</Text>
                        <Text style={styles.hintText}>Admin: admintms@gmail.com</Text>
                        <Text style={styles.hintText}>Password: password123</Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: '#0f172a' },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
        paddingTop: 60,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 36,
    },
    logoCircle: {
        width: 88,
        height: 88,
        borderRadius: 24,
        backgroundColor: '#1e293b',
        borderWidth: 1.5,
        borderColor: '#334155',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 8,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
    },
    logoIcon: { fontSize: 40 },
    appTitle: {
        fontSize: 30,
        fontWeight: '800',
        color: '#f1f5f9',
        letterSpacing: 0.5,
        marginBottom: 8,
    },
    appSubtitle: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 24,
        padding: 28,
        borderWidth: 1,
        borderColor: '#334155',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
    },
    errorBox: {
        backgroundColor: 'rgba(239,68,68,0.1)',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.25)',
        padding: 12,
        marginBottom: 16,
    },
    errorText: {
        color: '#f87171',
        fontSize: 13,
        fontWeight: '500',
    },
    loginBtn: {
        backgroundColor: '#6366f1',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 4,
        elevation: 5,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    loginBtnDisabled: { opacity: 0.6 },
    loginBtnText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    credentialsHint: {
        marginTop: 24,
        padding: 14,
        backgroundColor: 'rgba(99,102,241,0.08)',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(99,102,241,0.2)',
    },
    hintTitle: {
        color: '#818cf8',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 6,
    },
    hintText: {
        color: '#64748b',
        fontSize: 13,
        fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
        marginBottom: 2,
    },
});
