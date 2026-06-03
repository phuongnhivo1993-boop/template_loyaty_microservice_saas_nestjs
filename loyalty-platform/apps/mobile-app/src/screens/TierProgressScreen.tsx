import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuthStore } from '../services/authStore';
import { LoadingState } from '../components';

export default function TierProgressScreen() {
  const profile = useAuthStore((s) => s.profile);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) setLoading(false);
  }, [profile]);

  if (loading) return <LoadingState />;

  const currentTier = profile?.tier?.name || 'Bronze';
  const tierColor = profile?.tier?.color || '#cd7f32';
  const totalPoints = profile?.totalPoints || 0;
  const minPoints = profile?.tier?.minPoints || 0;
  const maxPoints = profile?.tier?.maxPoints || 500;
  const progress = maxPoints > minPoints ? ((totalPoints - minPoints) / (maxPoints - minPoints)) * 100 : 50;
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const tiers = [
    { name: 'Bronze', color: '#cd7f32', min: 0, max: 500 },
    { name: 'Silver', color: '#94a3b8', min: 500, max: 2000 },
    { name: 'Gold', color: '#f59e0b', min: 2000, max: 5000 },
    { name: 'Platinum', color: '#6366f1', min: 5000, max: 999999 },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tier Progress</Text>

      <View style={[styles.currentTierCard, { borderColor: tierColor }]}>
        <Text style={[styles.currentTierName, { color: tierColor }]}>{currentTier}</Text>
        <Text style={styles.pointsText}>{totalPoints.toLocaleString()} points</Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${clampedProgress}%`, backgroundColor: tierColor }]} />
        </View>
        <Text style={styles.progressText}>{Math.round(clampedProgress)}% to next tier</Text>
      </View>

      <Text style={styles.sectionTitle}>All Tiers</Text>
      {tiers.map((tier, i) => {
        const isCurrent = tier.name === currentTier;
        const nextTier = tiers[i + 1];
        const pointsToNext = nextTier ? nextTier.min - totalPoints : 0;
        return (
          <View key={tier.name} style={[styles.tierRow, isCurrent && { backgroundColor: tier.color + '11', borderColor: tier.color }]}>
            <View style={[styles.tierDot, { backgroundColor: tier.color }]} />
            <View style={{ flex: 1 }}>
              <Text style={[styles.tierName, isCurrent && { color: tier.color, fontWeight: '800' }]}>{tier.name}</Text>
              <Text style={styles.tierRange}>{tier.min.toLocaleString()} - {tier.max.toLocaleString()} points</Text>
            </View>
            {isCurrent && nextTier && pointsToNext > 0 && (
              <Text style={styles.nextPoints}>+{pointsToNext.toLocaleString()} pts</Text>
            )}
          </View>
        );
      })}
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingTop: 60 },
  title: { fontSize: 24, fontWeight: '800', color: '#1e293b', paddingHorizontal: 20, marginBottom: 16 },
  currentTierCard: { marginHorizontal: 20, backgroundColor: 'white', borderRadius: 20, padding: 24, borderWidth: 2, alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  currentTierName: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
  pointsText: { fontSize: 16, color: '#64748b' },
  progressSection: { paddingHorizontal: 20, marginTop: 20, marginBottom: 24 },
  progressBar: { height: 12, backgroundColor: '#f1f5f9', borderRadius: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 6 },
  progressText: { fontSize: 13, color: '#64748b', marginTop: 8, textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b', paddingHorizontal: 20, marginBottom: 12 },
  tierRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginBottom: 8, padding: 16, backgroundColor: 'white', borderRadius: 14, borderWidth: 1, borderColor: '#f1f5f9' },
  tierDot: { width: 14, height: 14, borderRadius: 7, marginRight: 14 },
  tierName: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  tierRange: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  nextPoints: { paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#fef3c7', borderRadius: 8, fontSize: 13, fontWeight: '700', color: '#d97706', overflow: 'hidden' },
});
