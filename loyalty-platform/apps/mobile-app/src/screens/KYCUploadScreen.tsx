import { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image, ActivityIndicator, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { members } from '../services/api';
import { useAuthStore } from '../services/authStore';

export default function KYCUploadScreen() {
  const profile = useAuthStore((s) => s.profile);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [idNumber, setIdNumber] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const pickImage = async (side: 'front' | 'back') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera roll permission is required');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      if (side === 'front') setFrontImage(result.assets[0].uri);
      else setBackImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!frontImage || !backImage) {
      Alert.alert('Missing', 'Please upload both front and back images');
      return;
    }
    if (!fullName || !idNumber) {
      Alert.alert('Missing', 'Please enter your full name and ID number');
      return;
    }
    setSubmitting(true);
    try {
      await members.updateProfile({ fullName });
      Alert.alert('Submitted', 'Your KYC documents have been submitted for review.');
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to submit KYC');
    }
    setSubmitting(false);
  };

  if (profile?.kycVerified) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={styles.container}>
        <Text style={styles.title}>KYC Verification</Text>
        <View style={styles.verifiedBox}>
          <Text style={styles.verifiedIcon}>✅</Text>
          <Text style={styles.verifiedText}>Your identity has been verified</Text>
        </View>
      </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Identity Verification</Text>
      <Text style={styles.subtitle}>Please upload your ID document for verification</Text>

      <Text style={styles.inputLabel}>Full Name</Text>
      <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Enter your full name" />

      <Text style={styles.inputLabel}>ID Number</Text>
      <TextInput style={styles.input} value={idNumber} onChangeText={setIdNumber} placeholder="Enter ID number" keyboardType="numeric" />

      <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage('front')}>
        <Text style={styles.uploadText}>{frontImage ? '✅ Front ID Uploaded' : '📷 Upload Front ID'}</Text>
      </TouchableOpacity>
      {frontImage && <Image source={{ uri: frontImage }} style={styles.preview} />}

      <TouchableOpacity style={styles.uploadBtn} onPress={() => pickImage('back')}>
        <Text style={styles.uploadText}>{backImage ? '✅ Back ID Uploaded' : '📷 Upload Back ID'}</Text>
      </TouchableOpacity>
      {backImage && <Image source={{ uri: backImage }} style={styles.preview} />}

      <TouchableOpacity style={[styles.submitBtn, submitting && { opacity: 0.6 }]} onPress={handleSubmit} disabled={submitting}>
        {submitting ? <ActivityIndicator color="white" /> : <Text style={styles.submitText}>Submit Verification</Text>}
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Requirements</Text>
        <Text style={styles.infoText}>• Clear photo of your ID document</Text>
        <Text style={styles.infoText}>• All four corners visible</Text>
        <Text style={styles.infoText}>• No glare or reflections</Text>
        <Text style={styles.infoText}>• Valid government-issued ID</Text>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', paddingHorizontal: 20, marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#64748b', paddingHorizontal: 20, marginBottom: 24 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: '#1e293b', paddingHorizontal: 20, marginBottom: 6 },
  input: { marginHorizontal: 20, padding: 14, backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', fontSize: 15, marginBottom: 16 },
  uploadBtn: { marginHorizontal: 20, padding: 16, backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'dashed', alignItems: 'center', marginBottom: 12 },
  uploadText: { fontSize: 15, color: '#2563eb', fontWeight: '600' },
  preview: { marginHorizontal: 20, height: 120, borderRadius: 12, marginBottom: 12, resizeMode: 'cover' },
  submitBtn: { marginHorizontal: 20, padding: 16, backgroundColor: '#2563eb', borderRadius: 14, alignItems: 'center', marginTop: 8 },
  submitText: { color: 'white', fontSize: 16, fontWeight: '700' },
  infoBox: { margin: 20, padding: 16, backgroundColor: '#fffbeb', borderRadius: 12 },
  infoTitle: { fontSize: 15, fontWeight: '600', color: '#d97706', marginBottom: 8 },
  infoText: { fontSize: 14, color: '#64748b', lineHeight: 22 },
  verifiedBox: { alignItems: 'center', paddingVertical: 60 },
  verifiedIcon: { fontSize: 60, marginBottom: 16 },
  verifiedText: { fontSize: 18, fontWeight: '600', color: '#16a34a' },
});
