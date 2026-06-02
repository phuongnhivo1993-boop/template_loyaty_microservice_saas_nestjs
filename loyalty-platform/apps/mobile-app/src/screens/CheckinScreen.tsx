import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { checkin } from '../services/api';
import type { CheckinStats, DailyCheckin } from '../services/types';
import { LoadingState, ErrorState } from '../components';

export default function CheckinScreen() {
  const [stats, setStats] = useState<CheckinStats | null>(null);
  const [history, setHistory] = useState<DailyCheckin[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);

  const load = () => {
    setLoading(true);
    setError('');
    Promise.all([
      checkin.stats().then(r => setStats(r.data)),
      checkin.history().then(r => setHistory(Array.isArray(r.data) ? r.data : [])),
    ]).catch(() => setError('Failed to load check-in data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCheckin = async () => {
    setCheckingIn(true);
    try {
      await checkin.do();
      load();
    } catch { setError('Check-in failed'); }
    setCheckingIn(false);
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  const checkedDates = new Set(history.map(h => new Date(h.date).toDateString()));

  return (
    <ScrollView style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} colors={['#2563eb']} />}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Check-in</Text>
        <View style={styles.streakRow}>
          <Text style={styles.fire}>🔥</Text>
          <Text style={styles.streakNum}>{stats?.currentStreak || 0}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.totalCheckins || 0}</Text>
            <Text style={styles.statSub}>Total</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{stats?.longestStreak || 0}</Text>
            <Text style={styles.statSub}>Best</Text>
          </View>
        </View>
      </View>

      <View style={styles.calendar}>
        <Text style={styles.monthLabel}>{today.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}</Text>
        <View style={styles.weekRow}>
          {dayNames.map(d => <Text key={d} style={styles.weekDay}>{d}</Text>)}
        </View>
        <View style={styles.daysGrid}>
          {Array.from({ length: firstDay }, (_, i) => <View key={`empty-${i}`} style={styles.dayBox} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const d = new Date(today.getFullYear(), today.getMonth(), i + 1);
            const isChecked = checkedDates.has(d.toDateString());
            const isToday = i + 1 === today.getDate();
            return (
              <View key={i} style={[styles.dayBox, isChecked && styles.dayChecked, isToday && styles.dayToday]}>
                <Text style={[styles.dayText, isChecked && styles.dayTextChecked, isToday && styles.dayTextToday]}>{i + 1}</Text>
                {isChecked && <Text style={styles.dot}>✓</Text>}
              </View>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={[styles.checkinBtn, stats?.checkedInToday && styles.checkinBtnDone]}
        onPress={handleCheckin} disabled={stats?.checkedInToday || checkingIn}>
        <Text style={styles.checkinBtnText}>
          {checkingIn ? 'Checking in...' : stats?.checkedInToday ? '✓ Checked In Today' : 'Check In Now'}
        </Text>
        {!stats?.checkedInToday && <Text style={styles.checkinBonus}>Earn up to 100 points!</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { alignItems: 'center', padding: 32, paddingTop: 60, backgroundColor: '#1e293b' },
  title: { fontSize: 20, fontWeight: '700', color: 'white', marginBottom: 16 },
  streakRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  fire: { fontSize: 28 },
  streakNum: { fontSize: 36, fontWeight: '800', color: '#fbbf24' },
  streakLabel: { fontSize: 16, color: '#94a3b8' },
  statsRow: { flexDirection: 'row', gap: 40, marginTop: 8 },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '700', color: 'white' },
  statSub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  calendar: { backgroundColor: 'white', margin: 16, borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  monthLabel: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12, textAlign: 'center' },
  weekRow: { flexDirection: 'row', marginBottom: 8 },
  weekDay: { width: '14.28%', textAlign: 'center', fontSize: 12, color: '#94a3b8', fontWeight: '600' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayBox: { width: '14.28%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', padding: 2 },
  dayChecked: { backgroundColor: '#dcfce7', borderRadius: 8 },
  dayToday: { borderWidth: 2, borderColor: '#2563eb', borderRadius: 8 },
  dayText: { fontSize: 14, color: '#1e293b', fontWeight: '500' },
  dayTextChecked: { color: '#16a34a', fontWeight: '700' },
  dayTextToday: { color: '#2563eb', fontWeight: '700' },
  dot: { fontSize: 10, color: '#16a34a', fontWeight: '700' },
  checkinBtn: { margin: 16, padding: 20, backgroundColor: '#2563eb', borderRadius: 16, alignItems: 'center' },
  checkinBtnDone: { backgroundColor: '#16a34a' },
  checkinBtnText: { fontSize: 18, fontWeight: '700', color: 'white' },
  checkinBonus: { fontSize: 13, color: '#bfdbfe', marginTop: 4 },
});
