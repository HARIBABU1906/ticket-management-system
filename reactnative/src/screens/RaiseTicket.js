import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    StatusBar,
    Platform,
} from 'react-native';
import CustomInput from '../components/CustomInput';
import client from '../api/client';

const COMPLAINT_TYPES = [
    'PC Hardware',
    'PC Software',
    'Application Issues',
    'Network',
    'Electronics',
    'Plumbing',
    'Other',
];

const TYPE_ICONS = {
    'PC Hardware': '🖥️',
    'PC Software': '💿',
    'Application Issues': '📱',
    'Network': '🌐',
    'Electronics': '⚡',
    'Plumbing': '🔧',
    'Other': '📌',
};

function Selector({ label, options, selected, onSelect, displayKey = 'name', loading }) {
    const [open, setOpen] = useState(false);
    const selectedItem = options.find((o) => o._id === selected);
    return (
        <View style={styles.selectorWrapper}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity style={styles.selectorBtn} onPress={() => setOpen(!open)}>
                {loading ? (
                    <ActivityIndicator size="small" color="#6366f1" />
                ) : (
                    <Text style={selectedItem ? styles.selectorSelected : styles.selectorPlaceholder}>
                        {selectedItem ? selectedItem[displayKey] : `Select ${label}`}
                    </Text>
                )}
                <Text style={styles.selectorArrow}>{open ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {open && (
                <View style={styles.dropdown}>
                    <ScrollView style={{ maxHeight: 200 }} nestedScrollEnabled>
                        {options.map((item) => (
                            <TouchableOpacity
                                key={item._id}
                                style={[styles.dropdownItem, selected === item._id && styles.dropdownItemActive]}
                                onPress={() => { onSelect(item._id); setOpen(false); }}
                            >
                                <Text style={[styles.dropdownText, selected === item._id && styles.dropdownTextActive]}>
                                    {item[displayKey]}
                                </Text>
                                {selected === item._id && <Text style={{ color: '#6366f1' }}>✓</Text>}
                            </TouchableOpacity>
                        ))}
                        {options.length === 0 && (
                            <Text style={styles.dropdownEmpty}>No options available</Text>
                        )}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

function TypeSelector({ selected, onSelect }) {
    const [open, setOpen] = useState(false);
    return (
        <View style={styles.selectorWrapper}>
            <Text style={styles.label}>Complaint Type</Text>
            <TouchableOpacity style={styles.selectorBtn} onPress={() => setOpen(!open)}>
                <Text style={selected ? styles.selectorSelected : styles.selectorPlaceholder}>
                    {selected ? `${TYPE_ICONS[selected]} ${selected}` : 'Select Type'}
                </Text>
                <Text style={styles.selectorArrow}>{open ? '▲' : '▼'}</Text>
            </TouchableOpacity>
            {open && (
                <View style={styles.dropdown}>
                    {COMPLAINT_TYPES.map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[styles.dropdownItem, selected === type && styles.dropdownItemActive]}
                            onPress={() => { onSelect(type); setOpen(false); }}
                        >
                            <Text style={[styles.dropdownText, selected === type && styles.dropdownTextActive]}>
                                {TYPE_ICONS[type]} {type}
                            </Text>
                            {selected === type && <Text style={{ color: '#6366f1' }}>✓</Text>}
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

export default function RaiseTicket({ user, onBack, onSuccess }) {
    const [blocks, setBlocks] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState('');
    const [selectedRoom, setSelectedRoom] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [remarks, setRemarks] = useState('');
    const [loadingData, setLoadingData] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const authHeader = { headers: { Authorization: `Bearer ${user.token}` } };

    useEffect(() => {
        const fetchMasterData = async () => {
            try {
                const [blocksRes, roomsRes] = await Promise.all([
                    client.get('/master/blocks', authHeader),
                    client.get('/master/rooms', authHeader),
                ]);
                setBlocks(blocksRes.data);
                setRooms(roomsRes.data);
            } catch (err) {
                Alert.alert('Error', 'Failed to load form data.');
            } finally {
                setLoadingData(false);
            }
        };
        fetchMasterData();
    }, []);

    useEffect(() => {
        if (selectedBlock) {
            const filtered = rooms.filter((r) => r.block?._id === selectedBlock || r.block === selectedBlock);
            setFilteredRooms(filtered);
            setSelectedRoom('');
        } else {
            setFilteredRooms([]);
        }
    }, [selectedBlock, rooms]);

    const handleSubmit = async () => {
        if (!selectedBlock || !selectedRoom || !selectedType || !remarks.trim()) {
            Alert.alert('Missing Fields', 'Please fill in all fields before submitting.');
            return;
        }
        setSubmitting(true);
        try {
            await client.post('/complaints', {
                block: selectedBlock,
                room: selectedRoom,
                type: selectedType,
                remarks: remarks.trim(),
            }, authHeader);
            Alert.alert('Success! 🎉', 'Your ticket has been raised successfully.', [
                { text: 'OK', onPress: onSuccess },
            ]);
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to raise ticket. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={onBack}>
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Raise Ticket</Text>
                <View style={{ width: 60 }} />
            </View>

            <ScrollView
                style={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.formCard}>
                    <Text style={styles.formTitle}>🎫 New Support Request</Text>
                    <Text style={styles.formSubtitle}>Fill out the form below to report an issue</Text>

                    {loadingData ? (
                        <View style={styles.loadingBox}>
                            <ActivityIndicator color="#6366f1" size="large" />
                            <Text style={styles.loadingText}>Loading form data...</Text>
                        </View>
                    ) : (
                        <>
                            <Selector
                                label="Block"
                                options={blocks}
                                selected={selectedBlock}
                                onSelect={setSelectedBlock}
                            />
                            <Selector
                                label="Room"
                                options={filteredRooms}
                                selected={selectedRoom}
                                onSelect={setSelectedRoom}
                                displayKey="roomNumber"
                            />
                            <TypeSelector
                                selected={selectedType}
                                onSelect={setSelectedType}
                            />
                            <CustomInput
                                label="Description / Remarks"
                                value={remarks}
                                onChangeText={setRemarks}
                                placeholder="Describe the issue in detail..."
                                multiline
                                numberOfLines={4}
                                icon="📝"
                            />

                            <TouchableOpacity
                                style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                                onPress={handleSubmit}
                                disabled={submitting}
                                activeOpacity={0.85}
                            >
                                {submitting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.submitBtnText}>🚀  Submit Ticket</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}
                </View>
                <View style={{ height: 60 }} />
            </ScrollView>
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
        paddingBottom: 18,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
    },
    backBtn: {
        width: 60,
    },
    backText: {
        color: '#6366f1',
        fontSize: 15,
        fontWeight: '600',
    },
    headerTitle: {
        color: '#f1f5f9',
        fontSize: 18,
        fontWeight: '800',
    },
    scroll: {
        flex: 1,
        padding: 20,
    },
    formCard: {
        backgroundColor: '#1e293b',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#334155',
        marginTop: 8,
    },
    formTitle: {
        color: '#f1f5f9',
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 6,
    },
    formSubtitle: {
        color: '#64748b',
        fontSize: 13,
        marginBottom: 28,
    },
    loadingBox: {
        alignItems: 'center',
        padding: 40,
        gap: 16,
    },
    loadingText: {
        color: '#64748b',
        fontSize: 14,
    },
    label: {
        color: '#cbd5e1',
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 8,
        letterSpacing: 0.3,
    },
    selectorWrapper: {
        marginBottom: 18,
    },
    selectorBtn: {
        backgroundColor: '#0f172a',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#334155',
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectorSelected: {
        color: '#f1f5f9',
        fontSize: 15,
        fontWeight: '500',
    },
    selectorPlaceholder: {
        color: '#4b5563',
        fontSize: 15,
    },
    selectorArrow: {
        color: '#64748b',
        fontSize: 12,
    },
    dropdown: {
        backgroundColor: '#0f172a',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#334155',
        marginTop: 4,
        overflow: 'hidden',
    },
    dropdownItem: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownItemActive: {
        backgroundColor: 'rgba(99,102,241,0.1)',
    },
    dropdownText: {
        color: '#94a3b8',
        fontSize: 14,
    },
    dropdownTextActive: {
        color: '#6366f1',
        fontWeight: '600',
    },
    dropdownEmpty: {
        color: '#4b5563',
        fontSize: 13,
        padding: 16,
        textAlign: 'center',
    },
    submitBtn: {
        backgroundColor: '#6366f1',
        borderRadius: 14,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        elevation: 5,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
    },
    submitBtnDisabled: { opacity: 0.6 },
    submitBtnText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
