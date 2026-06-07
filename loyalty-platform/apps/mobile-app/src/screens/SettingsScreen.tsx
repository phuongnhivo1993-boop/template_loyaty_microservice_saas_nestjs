import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../services/authStore';
import { auth } from '../services/api';
import { useTheme } from '../theme';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      <View style={[styles.profileCard, { backgroundColor: colors.card }]}>
        <View style={[styles.avatar, { backgroundColor: colors.primaryDark }]}>
          <Text style={[styles.avatarText, { color: colors.headerText }]}>{profile?.fullName?.charAt(0)?.toUpperCase() || 'M'}</Text>
        </View>
        <View>
          <Text style={[styles.profileName, { color: colors.text }]}>{profile?.fullName || 'Member'}</Text>
          <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{profile?.email || ''}</Text>
        </View>
      </View>

      <View style={[styles.menuSection, { backgroundColor: colors.card }]}>
        {menuItems.map((item, i) => (
          <TouchableOpacity key={i} style={[styles.menuItem, { borderBottomColor: colors.border }]} onPress={item.action}>
            <Text style={[styles.menuIcon]}>{item.icon}</Text>
            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
            <Text style={[styles.menuArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.menuSection, { backgroundColor: colors.card, marginTop: 24 }]}>
        <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
          <Text style={styles.menuIcon}>🌙</Text>
          <Text style={[styles.menuLabel, { color: colors.text }]}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={isDark ? colors.primaryDark : '#f4f3f4'}
          />
        </View>
      </View>

      <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.errorBg }]} onPress={handleLogout}>
        <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
      </TouchableOpacity>

      <Text style={[styles.version, { color: colors.textSecondary }]}>Version 1.0.0</Text>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '800', paddingHorizontal: 20, marginBottom: 16 },
  profileCard: { marginHorizontal: 20, flexDirection: 'row', alignItems: 'center', borderRadius: 16, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  avatar: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { fontSize: 22, fontWeight: '700' },
  profileName: { fontSize: 18, fontWeight: '700' },
  profileEmail: { fontSize: 14, marginTop: 2 },
  menuSection: { marginHorizontal: 20, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1 },
  menuIcon: { fontSize: 20, marginRight: 14 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  menuArrow: { fontSize: 22, fontWeight: '300' },
  logoutBtn: { marginHorizontal: 20, marginTop: 24, padding: 16, borderRadius: 14, alignItems: 'center' },
  logoutText: { fontSize: 16, fontWeight: '700' },
  version: { textAlign: 'center', fontSize: 13, paddingVertical: 24 },
});
