import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    StatusBar,
    Dimensions,
    Animated,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width } = Dimensions.get('window');
const SCAN_AREA_SIZE = width * 0.7;

export default function QRScannerScreen({ onBack }) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [scanLineAnim] = useState(new Animated.Value(0));

    // Animate the scan line
    useEffect(() => {
        const animate = () => {
            scanLineAnim.setValue(0);
            Animated.loop(
                Animated.timing(scanLineAnim, {
                    toValue: 1,
                    duration: 2500,
                    useNativeDriver: true,
                })
            ).start();
        };
        animate();
    }, []);

    const scanLineTranslate = scanLineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, SCAN_AREA_SIZE - 4],
    });

    const handleBarcodeScanned = ({ type, data }) => {
        if (scanned) return;
        setScanned(true);
        Alert.alert(
            '✅ QR Code Scanned!',
            `Type: ${type}\n\nData: ${data}`,
            [
                { text: 'Scan Again', onPress: () => setScanned(false) },
                { text: 'Close', onPress: onBack, style: 'cancel' },
            ]
        );
    };

    // Permission not yet determined
    if (!permission) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
                <Text style={styles.permText}>Requesting camera permission...</Text>
            </View>
        );
    }

    // Permission denied
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
                <View style={styles.permBox}>
                    <Text style={styles.permIcon}>📷</Text>
                    <Text style={styles.permTitle}>Camera Access Required</Text>
                    <Text style={styles.permDesc}>
                        We need camera access to scan QR codes and barcodes.
                    </Text>
                    <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
                        <Text style={styles.permBtnText}>Grant Permission</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.backBtnAlt} onPress={onBack}>
                        <Text style={styles.backBtnAltText}>← Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
            <CameraView
                style={StyleSheet.absoluteFillObject}
                barcodeScannerSettings={{
                    barcodeTypes: [
                        'qr',
                        'ean13',
                        'ean8',
                        'code128',
                        'code39',
                        'code93',
                        'upc_a',
                        'upc_e',
                        'pdf417',
                        'aztec',
                        'datamatrix',
                    ],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />

            {/* Overlay */}
            <View style={styles.overlay}>
                {/* Top */}
                <View style={styles.overlaySection} />

                {/* Middle row */}
                <View style={styles.middleRow}>
                    <View style={styles.overlaySection} />

                    {/* Scan area with corners */}
                    <View style={styles.scanArea}>
                        {/* Corner markers */}
                        <View style={[styles.corner, styles.cornerTL]} />
                        <View style={[styles.corner, styles.cornerTR]} />
                        <View style={[styles.corner, styles.cornerBL]} />
                        <View style={[styles.corner, styles.cornerBR]} />

                        {/* Animated scan line */}
                        {!scanned && (
                            <Animated.View
                                style={[
                                    styles.scanLine,
                                    { transform: [{ translateY: scanLineTranslate }] },
                                ]}
                            />
                        )}
                    </View>

                    <View style={styles.overlaySection} />
                </View>

                {/* Bottom */}
                <View style={[styles.overlaySection, styles.bottomSection]}>
                    <Text style={styles.instructionText}>
                        {scanned ? '✅ Code detected!' : 'Align QR code within the frame'}
                    </Text>
                    {scanned && (
                        <TouchableOpacity
                            style={styles.rescanBtn}
                            onPress={() => setScanned(false)}
                        >
                            <Text style={styles.rescanBtnText}>🔄 Tap to Scan Again</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerBackBtn} onPress={onBack}>
                    <Text style={styles.headerBackText}>✕</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>QR Scanner</Text>
                <View style={{ width: 44 }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlaySection: {
        flex: 1,
        width: '100%',
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
    },
    middleRow: {
        flexDirection: 'row',
        height: SCAN_AREA_SIZE,
    },
    scanArea: {
        width: SCAN_AREA_SIZE,
        height: SCAN_AREA_SIZE,
        overflow: 'hidden',
    },
    corner: {
        position: 'absolute',
        width: 32,
        height: 32,
        borderColor: '#6366f1',
    },
    cornerTL: {
        top: 0,
        left: 0,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderTopLeftRadius: 12,
    },
    cornerTR: {
        top: 0,
        right: 0,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderTopRightRadius: 12,
    },
    cornerBL: {
        bottom: 0,
        left: 0,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderBottomLeftRadius: 12,
    },
    cornerBR: {
        bottom: 0,
        right: 0,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderBottomRightRadius: 12,
    },
    scanLine: {
        height: 3,
        backgroundColor: '#6366f1',
        width: '100%',
        borderRadius: 2,
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 8,
        elevation: 5,
    },
    bottomSection: {
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40,
    },
    instructionText: {
        color: '#f1f5f9',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    rescanBtn: {
        marginTop: 20,
        backgroundColor: '#6366f1',
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 28,
        elevation: 5,
    },
    rescanBtnText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 50,
        paddingBottom: 16,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerBackBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(30, 41, 59, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    headerBackText: {
        color: '#f1f5f9',
        fontSize: 20,
        fontWeight: '600',
    },
    headerTitle: {
        color: '#f1f5f9',
        fontSize: 18,
        fontWeight: '800',
    },
    permBox: {
        alignItems: 'center',
        padding: 32,
        backgroundColor: '#1e293b',
        borderRadius: 24,
        margin: 24,
        borderWidth: 1,
        borderColor: '#334155',
    },
    permIcon: {
        fontSize: 64,
        marginBottom: 20,
    },
    permTitle: {
        color: '#f1f5f9',
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 12,
    },
    permDesc: {
        color: '#94a3b8',
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
    },
    permBtn: {
        backgroundColor: '#6366f1',
        borderRadius: 14,
        paddingVertical: 16,
        paddingHorizontal: 40,
        elevation: 5,
        marginBottom: 16,
    },
    permBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    permText: {
        color: '#94a3b8',
        fontSize: 16,
    },
    backBtnAlt: {
        paddingVertical: 10,
    },
    backBtnAltText: {
        color: '#6366f1',
        fontSize: 15,
        fontWeight: '600',
    },
});
