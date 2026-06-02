import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { members } from '../services/api';
import { useAuthStore } from '../services/authStore';
import type { Member, Wallet } from '../services/types';
import { LoadingState, ErrorState } from '../components';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState<Member | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const logout = useAuthStore((s) => s.logout);

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([
      members.getProfile().then((r) => setProfile(r.data)),
      members.getWallet().then((r) => setWallet(r.data)),
    ]).catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {profile?.fullName || 'Member'}</Text>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout}><Text style={styles.logout}>Logout</Text></TouchableOpacity>
        </View>
      </View>

      <View style={styles.pointsCard}>
        <Text style={styles.pointsLabel}>Available Points</Text>
        <Text style={styles.pointsValue}>{(wallet?.available ?? profile?.availablePoints ?? 0).toLocaleString()}</Text>
        <Text style={styles.tier}>{profile?.tier?.name || 'Bronze'}</Text>
      </View>

      <View style={styles.menuGrid}>
        {[
          { label: 'Wallet', icon: '⭐', screen: 'Wallet' },
          { label: 'Rewards', icon: '🎁', screen: 'Rewards' },
          { label: 'Referrals', icon: '🔗', screen: 'Referrals' },
          { label: 'Badges', icon: '🏅', screen: 'Badges' },
          { label: 'Vouchers', icon: '🎟️', screen: 'Vouchers' },
          { label: 'Missions', icon: '🎯', screen: 'Missions' },
          { label: 'Password', icon: '🔒', screen: 'Password' },
        ].map((item) => (
          <TouchableOpacity key={item.screen} style={styles.menuItem} onPress={() => navigation.navigate(item.screen)}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rewards Near You</Text>
        <Text style={styles.sectionSubtitle}>Redeem your points for great rewards</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#1e293b' },
  greeting: { fontSize: 20, fontWeight: '700', color: 'white' },
  logout: { color: '#ef4444', fontSize: 14, fontWeight: '600' },
  notifIcon: { fontSize: 20 },
  pointsCard: { margin: 16, padding: 24, backgroundColor: '#2563eb', borderRadius: 16, alignItems: 'center' },
  pointsLabel: { fontSize: 14, color: '#bfdbfe' },
  pointsValue: { fontSize: 36, fontWeight: '800', color: 'white', marginVertical: 4 },
  tier: { fontSize: 14, color: '#bfdbfe', fontWeight: '600' },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12 },
  menuItem: { width: '47%', backgroundColor: 'white', borderRadius: 12, padding: 20, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  menuIcon: { fontSize: 32 },
  menuLabel: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginTop: 8 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  sectionSubtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
  errorText: { color: '#dc2626', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
});
