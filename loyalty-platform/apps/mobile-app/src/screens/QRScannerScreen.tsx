import { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { vouchers } from '../services/api';

export default function QRScannerScreen() {
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleBarCodeScanned = async (scanResult: BarcodeScanningResult) => {
    if (!scanning) return;
    setScanning(false);
    try {
      const data = scanResult.data;
      const res = await vouchers.validate(data);
      if (res.data?.valid) {
        await vouchers.redeemInStore(res.data.voucherId);
        setResult({ success: true, message: 'Voucher redeemed successfully!' });
      } else {
        setResult({ success: false, message: res.data?.message || 'Invalid or already used voucher' });
      }
    } catch {
      setResult({ success: false, message: 'Failed to redeem voucher. Please try again.' });
    }
  };

  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <View style={styles.container}>
          <Text style={styles.instruction}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
        <View style={styles.container}>
          <Text style={styles.instruction}>Camera access is required to scan QR codes</Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanning ? handleBarCodeScanned : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <View style={styles.container}>
          {result ? (
            <View style={styles.resultContainer}>
              <Text style={[styles.resultIcon, result.success ? styles.success : styles.error]}>
                {result.success ? '✓' : '✗'}
              </Text>
              <Text style={styles.resultMessage}>{result.message}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => { setResult(null); setScanning(true); }}
              >
                <Text style={styles.buttonText}>Scan Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.secondaryButton]}
                onPress={() => navigation.goBack()}
              >
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>Back</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <View style={styles.viewfinder}>
                <View style={styles.viewfinderFrame} />
              </View>
              <Text style={styles.instruction}>
                Align QR code within the frame to scan
              </Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </CameraView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  viewfinder: { width: 280, height: 280, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff', borderRadius: 16 },
  viewfinderFrame: { width: '100%', height: '100%', borderWidth: 2, borderColor: '#2563eb', borderRadius: 12, opacity: 0.5 },
  instruction: { color: '#fff', fontSize: 16, marginTop: 24, textAlign: 'center', paddingHorizontal: 32 },
  cancelButton: { marginTop: 32, paddingVertical: 12, paddingHorizontal: 48, borderRadius: 8, borderWidth: 1, borderColor: '#fff' },
  cancelText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  resultContainer: { alignItems: 'center', padding: 24 },
  resultIcon: { fontSize: 64, fontWeight: '800', marginBottom: 16 },
  success: { color: '#22c55e' },
  error: { color: '#ef4444' },
  resultMessage: { color: '#fff', fontSize: 18, textAlign: 'center', marginBottom: 24 },
  button: { width: '80%', paddingVertical: 14, backgroundColor: '#2563eb', borderRadius: 10, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#fff' },
  secondaryButtonText: { color: '#fff' },
});
