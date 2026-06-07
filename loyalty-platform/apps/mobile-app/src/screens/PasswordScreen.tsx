import { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { members } from '../services/api';
import Card from '../components/Card';

export default function PasswordScreen({ navigation }: any) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields'); return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match'); return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters'); return;
    }
    setLoading(true);
    try {
      await members.changePassword({ oldPassword, newPassword });
      Alert.alert('Success', 'Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message?.[0] || 'Failed to change password');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Password</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        <Card title="Change Password">
          <View style={styles.field}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput style={styles.input} secureTextEntry value={oldPassword}
              onChangeText={setOldPassword} placeholder="Enter current password" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>New Password</Text>
            <TextInput style={styles.input} secureTextEntry value={newPassword}
              onChangeText={setNewPassword} placeholder="Enter new password (min 6 chars)" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Confirm New Password</Text>
            <TextInput style={styles.input} secureTextEntry value={confirmPassword}
              onChangeText={setConfirmPassword} placeholder="Confirm new password" />
          </View>
          <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={handleChangePassword} disabled={loading}>
            <Text style={styles.btnText}>{loading ? 'Saving...' : 'Change Password'}</Text>
          </TouchableOpacity>
        </Card>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#1e293b' },
  backBtn: { color: '#60a5fa', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: 'white' },
  content: { padding: 16, flex: 1 },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, fontSize: 15, backgroundColor: 'white' },
  btn: { backgroundColor: '#2563eb', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
