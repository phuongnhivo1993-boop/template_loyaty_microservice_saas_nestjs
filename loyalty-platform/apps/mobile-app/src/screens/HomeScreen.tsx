import { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { members, analytics, auth } from '../services/api';
import { useAuthStore } from '../services/authStore';
import { useWsStore } from '../services/wsStore';
import type { Member, Wallet } from '../services/types';
import { LoadingState, ErrorState } from '../components';
import { useColors } from '../theme/useColors';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const colors = useColors();
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primaryDark]} />}>
      <View style={[styles.header, { backgroundColor: colors.text }]}>
        <Text style={styles.greeting}>Hi, {profile?.fullName || 'Member'}</Text>
        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
          <View style={[styles.wsDot,
            wsStatus === 'connected' ? styles.wsConnected :
            wsStatus === 'reconnecting' ? styles.wsReconnecting :
            styles.wsDisconnected
          ]} />
          <TouchableOpacity onPress={() => navigation.navigate('CreateOrder')}>
            <Ionicons name="cart-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}><Text style={styles.logout}>Logout</Text></TouchableOpacity>
        </View>
      </View>

      <View style={[styles.pointsCard, { backgroundColor: colors.primaryDark }]}>
        <Text style={styles.pointsLabel}>Available Points</Text>
        <Text style={styles.pointsValue}>{(wallet?.available ?? profile?.availablePoints ?? 0).toLocaleString()}</Text>
        <Text style={styles.tier}>{profile?.tier?.name || 'Bronze'}</Text>
      </View>

      <View style={styles.menuGrid}>
        {[
          { label: 'Wallet', icon: 'wallet-outline', screen: 'Wallet' },
          { label: 'Cashback', icon: 'cash-outline', screen: 'Cashback' },
          { label: 'Rewards', icon: 'gift-outline', screen: 'Rewards' },
          { label: 'Check-in', icon: 'calendar-outline', screen: 'Checkin' },
          { label: 'Stores', icon: 'location-outline', screen: 'Stores' },
          { label: 'Referrals', icon: 'link-outline', screen: 'Referrals' },
          { label: 'Vouchers', icon: 'ticket-outline', screen: 'Vouchers' },
          { label: 'Badges', icon: 'medal-outline', screen: 'Badges' },
          { label: 'Missions', icon: 'navigate-outline', screen: 'Missions' },
          { label: 'Feedback', icon: 'star-outline', screen: 'Feedback' },
          { label: 'Membership', icon: 'card-outline', screen: 'MembershipCard' },
          { label: 'Tiers', icon: 'bar-chart-outline', screen: 'TierProgress' },
          { label: 'KYC', icon: 'checkmark-circle-outline', screen: 'KYCUpload' },
          { label: 'Settings', icon: 'settings-outline', screen: 'Settings' },
          { label: 'Gift Cards', icon: 'albums-outline', screen: 'GiftCards' },
          { label: 'Profile', icon: 'person-outline', screen: 'Profile' },
        ].map((item) => (
          <TouchableOpacity key={item.screen} style={[styles.menuItem, { backgroundColor: colors.card }]} onPress={() => navigation.navigate(item.screen)}>
            <Ionicons name={item.icon as any} size={32} color={colors.text} />
            <Text style={[styles.menuLabel, { color: colors.text }]}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {leaderboard.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}><Ionicons name="trophy-outline" size={20} color={colors.text} /> Leaderboard</Text>
          {leaderboard.map((m: any) => (
            <View key={m.id} style={[styles.leaderboardRow, { backgroundColor: colors.card }]}>
              <View style={[styles.rankBadge, { backgroundColor: m.rank <= 3 ? '#f59e0b' : colors.border }]}>
                <Text style={[styles.rankText, { color: m.rank <= 3 ? 'white' : colors.textSecondary }]}>{m.rank}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', color: colors.text }}>{m.fullName}</Text>
                <Text style={{ fontSize: 12, color: m.tierColor || colors.textSecondary }}>{m.tier}</Text>
              </View>
              <Text style={{ fontWeight: '700', color: colors.primaryDark }}>{m.totalPoints?.toLocaleString()} pts</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 60 },
  greeting: { fontSize: 20, fontWeight: '700', color: 'white' },
  logout: { color: '#ef4444', fontSize: 14, fontWeight: '600' },
  notifIcon: { fontSize: 20 },
  createOrderIcon: { fontSize: 20 },
  wsDot: { width: 10, height: 10, borderRadius: 5 },
  wsConnected: { backgroundColor: '#22c55e' },
  wsReconnecting: { backgroundColor: '#f59e0b' },
  wsDisconnected: { backgroundColor: '#ef4444' },
  pointsCard: { margin: 16, padding: 24, borderRadius: 16, alignItems: 'center' },
  pointsLabel: { fontSize: 14, color: '#bfdbfe' },
  pointsValue: { fontSize: 36, fontWeight: '800', color: 'white', marginVertical: 4 },
  tier: { fontSize: 14, color: '#bfdbfe', fontWeight: '600' },
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, gap: 12 },
  menuItem: { width: '30%', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  menuIcon: { fontSize: 32 },
  menuLabel: { fontSize: 14, fontWeight: '600', marginTop: 8 },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  sectionSubtitle: { fontSize: 14, marginTop: 4 },
  leaderboardRow: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 10, padding: 14, marginTop: 8, gap: 12,
    shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  rankBadge: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  rankText: { fontSize: 14, fontWeight: '700' },
  errorText: { fontSize: 16, textAlign: 'center', paddingHorizontal: 20 },
});
