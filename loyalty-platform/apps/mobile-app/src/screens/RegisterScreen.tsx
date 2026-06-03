import { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { members } from '../services/api';

export default function RegisterScreen() {
  const navigation = useNavigation<any>();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tenantDomain, setTenantDomain] = useState('sunshine.loyalty.vn');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !tenantDomain) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await members.register({ email, fullName, phone: phone || undefined, tenantDomain });
      Alert.alert('Success', 'Registration successful! Please login.', [{ text: 'OK', onPress: () => navigation.navigate('Login') }]);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join our loyalty program</Text>

        <TextInput style={styles.input} placeholder="Full Name *" value={fullName} onChangeText={setFullName} autoCapitalize="words" />
        <TextInput style={styles.input} placeholder="Email *" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Tenant Domain *" value={tenantDomain} onChangeText={setTenantDomain} autoCapitalize="none" />

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
          {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Register</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center' },
  content: { padding: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#1e293b', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#64748b', marginBottom: 32 },
  input: { backgroundColor: 'white', borderRadius: 12, padding: 16, fontSize: 15, marginBottom: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  button: { backgroundColor: '#2563eb', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: 'white', fontWeight: '700', fontSize: 16 },
  linkContainer: { alignItems: 'center', marginTop: 20 },
  link: { color: '#2563eb', fontSize: 14, fontWeight: '600' },
});
