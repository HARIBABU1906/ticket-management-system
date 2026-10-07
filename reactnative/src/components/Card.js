import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const COLORS = {
    'Pending': '#f59e0b',
    'Accepted': '#3b82f6',
    'Assigned': '#8b5cf6',
    'In-Progress': '#06b6d4',
    'On-Hold': '#6b7280',
    'Completed': '#10b981',
};

export default function StatCard({ label, value, color }) {
    return (
        <View style={[styles.card, { borderTopColor: color || '#6366f1' }]}>
            <Text style={[styles.value, { color: color || '#6366f1' }]}>{value ?? '0'}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
}

export function TicketCard({ ticket }) {
    const statusColor = COLORS[ticket.status] || '#6b7280';
    return (
        <View style={styles.ticketCard}>
            <View style={styles.ticketHeader}>
                <Text style={styles.ticketType}>{ticket.type}</Text>
                <View style={[styles.badge, { backgroundColor: statusColor + '22' }]}>
                    <Text style={[styles.badgeText, { color: statusColor }]}>{ticket.status}</Text>
                </View>
            </View>
            <Text style={styles.ticketRemarks} numberOfLines={2}>{ticket.remarks}</Text>
            <View style={styles.ticketFooter}>
                <Text style={styles.ticketMeta}>🏢 {ticket.block?.name || 'N/A'}</Text>
                <Text style={styles.ticketMeta}>🚪 {ticket.room?.roomNumber || 'N/A'}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 16,
        flex: 1,
        margin: 5,
        alignItems: 'center',
        borderTopWidth: 3,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    value: {
        fontSize: 32,
        fontWeight: '800',
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        color: '#94a3b8',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    ticketCard: {
        backgroundColor: '#1e293b',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 3,
        borderLeftColor: '#6366f1',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    ticketType: {
        color: '#f1f5f9',
        fontWeight: '700',
        fontSize: 15,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    ticketRemarks: {
        color: '#94a3b8',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 10,
    },
    ticketFooter: {
        flexDirection: 'row',
        gap: 12,
    },
    ticketMeta: {
        color: '#64748b',
        fontSize: 12,
    },
});
