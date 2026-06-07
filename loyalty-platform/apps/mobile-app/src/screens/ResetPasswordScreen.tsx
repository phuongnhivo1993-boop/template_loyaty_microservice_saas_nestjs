import { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../services/api';
import TextInput from '../components/TextInput';

export default function ResetPasswordScreen() {
  const navigation = useNavigation<any>();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!token || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await auth.resetPassword({ token, newPassword });
      Alert.alert('Success', 'Password has been reset successfully.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err: any) {
      const msg = err?.response?.data?.message?.[0] || err?.response?.data?.message || 'Failed to reset password';
      Alert.alert('Error', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Text style={styles.title}>Set New Password</Text>
      <Text style={styles.subtitle}>Enter the reset token from your email and choose a new password</Text>
      <View style={styles.form}>
        <TextInput label="Reset Token" value={token} onChangeText={setToken} placeholder="Enter reset token" required />
        <TextInput label="New Password" value={newPassword} onChangeText={setNewPassword} secureTextEntry placeholder="Min 6 characters" required />
        <TextInput label="Confirm New Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Re-enter new password" required />
        <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Resetting...' : 'Reset Password'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: '#3b82f6', fontSize: 14, fontWeight: '600' }}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#1e293b' },
  title: { fontSize: 28, fontWeight: '700', color: 'white', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 40, paddingHorizontal: 20 },
  form: { gap: 14 },
  button: { backgroundColor: '#2563eb', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
