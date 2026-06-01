import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../services/api';
import { useAuthStore } from '../services/authStore';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const [email, setEmail] = useState('nguyen.van.a@sunshine.vn');
  const [password, setPassword] = useState('Member@123456');
  const [loading, setLoading] = useState(false);
  const setToken = useAuthStore((s) => s.setToken);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await auth.login({ email, password, role: 'member' });
      const token = res.data.accessToken;
      await SecureStore.setItemAsync('auth_token', token);
      setToken(token);
    } catch {
      Alert.alert('Error', 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loyalty Platform</Text>
      <Text style={styles.subtitle}>Member App</Text>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#1e293b' },
  title: { fontSize: 28, fontWeight: '700', color: 'white', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#94a3b8', textAlign: 'center', marginBottom: 40 },
  form: { gap: 14 },
  input: { backgroundColor: '#334155', borderRadius: 8, padding: 14, fontSize: 16, color: 'white' },
  button: { backgroundColor: '#2563eb', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
