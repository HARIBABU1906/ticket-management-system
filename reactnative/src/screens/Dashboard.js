import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    StatusBar,
    RefreshControl,
} from 'react-native';
import StatCard, { TicketCard } from '../components/Card';
import client from '../api/client';

const ROLE_COLORS = {
    SuperAdmin: '#ef4444',
    User: '#6366f1',
    'Networking Staff': '#0ea5e9',
    Plumber: '#f59e0b',
    Electrician: '#f97316',
    'Software Developer': '#10b981',
    Student: '#8b5cf6',
    Teacher: '#06b6d4',
};

export default function Dashboard({ user, onLogout, onRaiseTicket, onScanQR }) {
    const [stats, setStats] = useState({ total: 0, pending: 0, assigned: 0, closed: 0 });
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const authHeader = { headers: { Authorization: `Bearer ${user.token}` } };
    const roleColor = ROLE_COLORS[user.role] || '#6366f1';

    const fetchData = useCallback(async () => {
        try {
            const [statsRes, complaintsRes] = await Promise.all([
                client.get('/complaints/stats', authHeader),
                client.get('/complaints', authHeader),
            ]);
            setStats(statsRes.data);
            setComplaints(complaintsRes.data.slice(0, 10));
        } catch (err) {
            Alert.alert('Error', 'Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user.token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            {/* Header */}
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.greeting}>{getGreeting()},</Text>
                    <Text style={styles.userName}>{user.name}</Text>
                </View>
                <View style={styles.headerRight}>
                    <View style={[styles.roleBadge, { backgroundColor: roleColor + '22' }]}>
                        <Text style={[styles.roleText, { color: roleColor }]}>{user.role}</Text>
                    </View>
                    <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
                        <Text style={styles.logoutText}>⏻</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6366f1" />}
            >
                {/* Stats Section */}
                <Text style={styles.sectionTitle}>📊  Overview</Text>
                {loading ? (
                    <ActivityIndicator color="#6366f1" size="large" style={{ marginVertical: 24 }} />
                ) : (
                    <View style={styles.statsGrid}>
                        <View style={styles.statsRow}>
                            <StatCard label="Total" value={stats.total} color="#6366f1" />
                            <StatCard label="Pending" value={stats.pending} color="#f59e0b" />
                        </View>
                        <View style={styles.statsRow}>
                            <StatCard label="Assigned" value={stats.assigned} color="#8b5cf6" />
                            <StatCard label="Closed" value={stats.closed} color="#10b981" />
                        </View>
                    </View>
                )}

                {/* Recent Tickets Section */}
                <Text style={styles.sectionTitle}>🎫  Recent Tickets</Text>
                {loading ? (
                    <ActivityIndicator color="#6366f1" size="large" style={{ marginVertical: 24 }} />
                ) : complaints.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyIcon}>📭</Text>
                        <Text style={styles.emptyText}>No tickets found</Text>
                        <Text style={styles.emptySubText}>Raise a new ticket using the button below</Text>
                    </View>
                ) : (
                    complaints.map((ticket) => (
                        <TicketCard key={ticket._id} ticket={ticket} />
                    ))
                )}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.scanBtn} onPress={onScanQR} activeOpacity={0.85}>
                    <Text style={styles.scanBtnIcon}>📷</Text>
                    <Text style={styles.scanBtnText}>Scan QR</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.fab} onPress={onRaiseTicket} activeOpacity={0.85}>
                    <Text style={styles.fabIcon}>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    header: {
        backgroundColor: '#1e293b',
        paddingTop: 52,
        paddingBottom: 20,
        paddingHorizontal: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    greeting: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
    },
    userName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#f1f5f9',
        marginTop: 2,
    },
    headerRight: {
        alignItems: 'flex-end',
        gap: 8,
    },
    roleBadge: {
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },
    roleText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    logoutBtn: {
        backgroundColor: 'rgba(239,68,68,0.12)',
        borderRadius: 10,
        padding: 8,
        marginTop: 4,
    },
    logoutText: {
        fontSize: 18,
    },
    scroll: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
        marginTop: 8,
    },
    statsGrid: {
        marginBottom: 28,
    },
    statsRow: {
        flexDirection: 'row',
        marginBottom: 0,
    },
    emptyBox: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: '#1e293b',
        borderRadius: 20,
        marginBottom: 20,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 12,
    },
    emptyText: {
        color: '#f1f5f9',
        fontSize: 17,
        fontWeight: '700',
        marginBottom: 6,
    },
    emptySubText: {
        color: '#64748b',
        fontSize: 13,
        textAlign: 'center',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 24,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    scanBtn: {
        backgroundColor: '#1e293b',
        borderRadius: 28,
        paddingVertical: 14,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#334155',
    },
    scanBtnIcon: {
        fontSize: 18,
    },
    scanBtnText: {
        color: '#f1f5f9',
        fontSize: 14,
        fontWeight: '700',
    },
    fab: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#6366f1',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
    },
    fabIcon: {
        color: '#fff',
        fontSize: 32,
        fontWeight: '300',
        lineHeight: 36,
    },
});
