import { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, members } from '../services/api';
import { useAuthStore } from '../services/authStore';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken, setProfile } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const res = await auth.login({ email, password, role: 'member' });
      const token = res.data.accessToken;
      await SecureStore.setItemAsync('auth_token', token);
      setToken(token);
      try {
        const profileRes = await members.getProfile();
        setProfile(profileRes.data);
      } catch {}
    } catch {
      Alert.alert('Error', 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Text style={styles.title}>Loyalty Platform</Text>
      <Text style={styles.subtitle}>Member App</Text>
      <View style={styles.form}>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{ alignItems: 'center', marginTop: 12 }}>
          <Text style={{ color: '#94a3b8', fontSize: 14 }}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ alignItems: 'center', marginTop: 16 }}>
          <Text style={{ color: '#94a3b8', fontSize: 14 }}>Don't have an account? <Text style={{ color: '#3b82f6', fontWeight: '600' }}>Register</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
    </SafeAreaView>
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
