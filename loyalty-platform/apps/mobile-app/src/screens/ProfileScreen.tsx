import { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { members } from '../services/api';
import { useAuthStore } from '../services/authStore';
import Card from '../components/Card';
import { useColors } from '../theme/useColors';

export default function ProfileScreen({ navigation }: any) {
  const colors = useColors();
  const profile = useAuthStore((s) => s.profile);
  const setProfile = useAuthStore((s) => s.setProfile);
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    setLoading(true);
    try {
      const res = await members.updateProfile({ fullName: fullName.trim(), phone: phone.trim() || undefined });
      setProfile(res.data);
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message?.[0] || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
    <KeyboardAvoidingView style={[styles.container, { backgroundColor: colors.background }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.header, { backgroundColor: colors.text }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content}>
        <Card title="Personal Info">
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]} value={fullName} onChangeText={setFullName} placeholder="Enter your name" />
          </View>
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.border, borderColor: colors.border, color: colors.textSecondary }]} value={profile?.email || ''} editable={false} />
            <Text style={[styles.hint, { color: colors.textSecondary }]}>Email cannot be changed</Text>
          </View>
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>Phone</Text>
            <TextInput style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.border, color: colors.text }]} value={phone} onChangeText={setPhone} placeholder="Enter phone number" keyboardType="phone-pad" />
          </View>
          <TouchableOpacity style={[styles.btn, { backgroundColor: colors.primaryDark }, loading && styles.btnDisabled]} onPress={handleSave} disabled={loading}>
            <Text style={styles.btnText}>{loading ? 'Saving...' : 'Save Changes'}</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 },
  backBtn: { color: '#60a5fa', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: 'white' },
  content: { padding: 16, flex: 1 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 15 },
  hint: { fontSize: 11, marginTop: 4 },
  btn: { borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
