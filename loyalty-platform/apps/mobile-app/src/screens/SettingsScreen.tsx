import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../services/authStore';
import { auth } from '../services/api';

export default function SettingsScreen() {
  const navigation = useNavigation<any>();
  const profile = useAuthStore((s) => s.profile);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => {
        await auth.logout();
        logout();
      }},
    ]);
  };

  const menuItems = [
    { icon: '👤', label: 'Edit Profile', action: () => navigation.navigate('Profile') },
    { icon: '🔒', label: 'Change Password', action: () => navigation.navigate('Password') },
    { icon: '🎴', label: 'Membership Card', action: () => navigation.navigate('MembershipCard') },
    { icon: '📊', label: 'Tier Progress', action: () => navigation.navigate('TierProgress') },
    { icon: '📋', label: 'Transaction History', action: () => navigation.navigate('PointsHistory') },
    { icon: '🔔', label: 'Notifications', action: () => navigation.navigate('Notifications') },
    { icon: '✅', label: 'KYC Verification', action: () => navigation.navigate('KYCUpload') },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{profile?.fullName?.charAt(0)?.toUpperCase() || 'M'}</Text>
        </View>
        <View>
          <Text style={styles.profileName}>{profile?.fullName || 'Member'}</Text>
          <Text style={styles.profileEmail}>{profile?.email || ''}</Text>
        </View>
      </View>

      <View style={styles.menuSection}>
        {menuItems.map((item, i) => (
          <TouchableOpacity key={i} style={styles.menuItem} onPress={item.action}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', paddingHorizontal: 20, marginBottom: 16 },
  profileCard: { marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 16, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#2563eb', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { fontSize: 22, fontWeight: '700', color: 'white' },
  profileName: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  profileEmail: { fontSize: 14, color: '#64748b', marginTop: 2 },
  menuSection: { marginHorizontal: 20, backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  menuIcon: { fontSize: 20, marginRight: 14 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1e293b' },
  menuArrow: { fontSize: 22, color: '#94a3b8', fontWeight: '300' },
  logoutBtn: { marginHorizontal: 20, marginTop: 24, padding: 16, backgroundColor: '#fef2f2', borderRadius: 14, alignItems: 'center' },
  logoutText: { color: '#dc2626', fontSize: 16, fontWeight: '700' },
  version: { textAlign: 'center', color: '#94a3b8', fontSize: 13, paddingVertical: 24 },
});
