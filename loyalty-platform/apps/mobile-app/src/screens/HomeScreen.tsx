import { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { members, analytics } from '../services/api';
import { useAuthStore } from '../services/authStore';
import { useWsStore } from '../services/wsStore';
import { auth } from '../services/api';
import * as SecureStore from 'expo-secure-store';
import type { Member, Wallet } from '../services/types';
import { LoadingState, ErrorState } from '../components';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [profile, setProfile] = useState<Member | null>(null);
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const logout = useAuthStore((s) => s.logout);

  const wsStatus = useWsStore(s => s.status);

  const handleLogout = async () => {
    await auth.logout();
    logout();
  };

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([
      members.getProfile().then((r) => setProfile(r.data)),
      members.getWallet().then((r) => setWallet(r.data)),
      analytics.leaderboard(5).then((r) => setLeaderboard(Array.isArray(r.data) ? r.data : r.data?.data || [])),
    ]).catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      members.getProfile().then((r) => setProfile(r.data)),
      members.getWallet().then((r) => setWallet(r.data)),
      analytics.leaderboard(5).then((r) => setLeaderboard(Array.isArray(r.data) ? r.data : r.data?.data || [])),
    ]).catch(() => setError('Failed to load data'));
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <ScrollView style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563eb']} />}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {profile?.fullName || 'Member'}</Text>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={[styles.wsDot,
            wsStatus === 'connected' ? styles.wsConnected :
            wsStatus === 'reconnecting' ? styles.wsReconnecting :
            styles.wsDisconnected
          ]} />
          <TouchableOpacity onPress={() => navigation.navigate('CreateOrder')}>
            <Text style={styles.createOrderIcon}>🛒</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Text style={styles.notifIcon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}><Text style={styles.logout}>Logout</Text></TouchableOpacity>
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
          { label: 'Cashback', icon: '💵', screen: 'Cashback' },
          { label: 'Rewards', icon: '🎁', screen: 'Rewards' },
          { label: 'Check-in', icon: '📅', screen: 'Checkin' },
          { label: 'Stores', icon: '📍', screen: 'Stores' },
          { label: 'Referrals', icon: '🔗', screen: 'Referrals' },
          { label: 'Vouchers', icon: '🎟️', screen: 'Vouchers' },
          { label: 'Badges', icon: '🏅', screen: 'Badges' },
          { label: 'Missions', icon: '🎯', screen: 'Missions' },
          { label: 'Feedback', icon: '⭐', screen: 'Feedback' },
          { label: 'Membership', icon: '💳', screen: 'MembershipCard' },
          { label: 'Tiers', icon: '📊', screen: 'TierProgress' },
          { label: 'KYC', icon: '✅', screen: 'KYCUpload' },
          { label: 'Settings', icon: '⚙️', screen: 'Settings' },
          { label: 'Profile', icon: '👤', screen: 'Profile' },
        ].map((item) => (
          <TouchableOpacity key={item.screen} style={styles.menuItem} onPress={() => navigation.navigate(item.screen)}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {leaderboard.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏆 Leaderboard</Text>
          {leaderboard.map((m: any) => (
            <View key={m.id} style={styles.leaderboardRow}>
              <View style={[styles.rankBadge, { backgroundColor: m.rank <= 3 ? '#f59e0b' : '#e2e8f0' }]}>
                <Text style={[styles.rankText, { color: m.rank <= 3 ? 'white' : '#64748b' }]}>{m.rank}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', color: '#1e293b' }}>{m.fullName}</Text>
                <Text style={{ fontSize: 12, color: m.tierColor || '#94a3b8' }}>{m.tier}</Text>
              </View>
              <Text style={{ fontWeight: '700', color: '#2563eb' }}>{m.totalPoints?.toLocaleString()} pts</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#1e293b' },
  greeting: { fontSize: 20, fontWeight: '700', color: 'white' },
  logout: { color: '#ef4444', fontSize: 14, fontWeight: '600' },
  notifIcon: { fontSize: 20 },
  createOrderIcon: { fontSize: 20 },
  wsDot: { width: 10, height: 10, borderRadius: 5 },
  wsConnected: { backgroundColor: '#22c55e' },
  wsReconnecting: { backgroundColor: '#f59e0b' },
  wsDisconnected: { backgroundColor: '#ef4444' },
  pointsCard: { margin: 16, padding: 24, backgroundColor: '#2563eb', borderRadius: 16, alignItems: 'center' },
  pointsLabel: { fontSize: 14, color: '#bfdbfe' },
  pointsValue: { fontSize: 36, fontWeight: '800', color: 'white', marginVertical: 4 },
  tier: { fontSize: 14, color: '#bfdbfe', fontWeight: '600' },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12 },
  menuItem: { width: '30%', backgroundColor: 'white', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  menuIcon: { fontSize: 32 },
  menuLabel: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginTop: 8 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  sectionSubtitle: { fontSize: 14, color: '#64748b', marginTop: 4 },
  leaderboardRow: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white',
    borderRadius: 10, padding: 14, marginTop: 8, gap: 12,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  rankBadge: {
    width: 32, height: 32, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
  },
  rankText: { fontSize: 14, fontWeight: '700' },
  errorText: { color: '#dc2626', fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
});
