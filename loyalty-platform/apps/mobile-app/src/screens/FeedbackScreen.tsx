import { useEffect, useState, useCallback } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { feedback } from '../services/api';
import type { Feedback } from '../services/types';
import { LoadingState, ErrorState, EmptyState, Header, Button, TextInput } from '../components';
import { useColors } from '../theme/useColors';

const RATINGS = [1, 2, 3, 4, 5];

export default function FeedbackScreen() {
  const colors = useColors();
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'list' | 'new'>('list');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    setError('');
    feedback.list()
      .then(r => setItems(Array.isArray(r.data) ? r.data : r.data?.data || []))
      .catch(() => setError('Failed to load feedback'))
      .finally(() => setLoading(false));
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const r = await feedback.list();
      setItems(Array.isArray(r.data) ? r.data : r.data?.data || []);
    } catch { setError('Failed to load feedback'); }
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    setSubmitting(true);
    try {
      await feedback.create({ rating, comment: comment.trim() || undefined });
      Alert.alert('Success', 'Your feedback has been submitted!');
      setRating(0);
      setComment('');
      setTab('list');
      load();
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to submit feedback');
    }
    setSubmitting(false);
  };

  const renderStars = (current: number, interactive = false) => (
    <View style={styles.stars}>
      {RATINGS.map(n => (
        <TouchableOpacity key={n} onPress={interactive ? () => setRating(n) : undefined} disabled={!interactive}>
          <Text style={[styles.star, { color: n <= current ? colors.warning : colors.border }]}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <Header title="Feedback" subtitle="Share your thoughts" />

      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, { backgroundColor: colors.border }, tab === 'list' && { backgroundColor: colors.primaryDark }]} onPress={() => setTab('list')}>
          <Text style={[styles.tabText, { color: colors.textSecondary }, tab === 'list' && styles.tabTextActive]}>My Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, { backgroundColor: colors.border }, tab === 'new' && { backgroundColor: colors.primaryDark }]} onPress={() => setTab('new')}>
          <Text style={[styles.tabText, { color: colors.textSecondary }, tab === 'new' && styles.tabTextActive]}>New Feedback</Text>
        </TouchableOpacity>
      </View>

      {tab === 'list' ? (
        <FlatList
          style={styles.container}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primaryDark]} />}
          data={items}
          keyExtractor={(item: Feedback) => item.id}
          renderItem={({ item }: { item: Feedback }) => (
            <View style={[styles.fbCard, { backgroundColor: colors.card }]}>
              <View style={styles.fbHeader}>
                {renderStars(item.rating)}
                <Text style={[styles.fbDate, { color: colors.textSecondary }]}>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</Text>
              </View>
              {item.comment && <Text style={[styles.fbComment, { color: colors.textSecondary }]}>{item.comment}</Text>}
              {item.memberName && <Text style={[styles.fbMember, { color: colors.textSecondary }]}>- {item.memberName}</Text>}
            </View>
          )}
          ListEmptyComponent={<EmptyState message="No feedback yet" icon="⭐" />}
        />
      ) : (
        <View style={styles.form}>
          <Text style={[styles.formLabel, { color: colors.text }]}>Rating</Text>
          {renderStars(rating, true)}
          <TextInput
            label="Comment (optional)"
            value={comment}
            onChangeText={setComment}
            placeholder="Write your feedback..."
          />
          <Button title="Submit Feedback" onPress={handleSubmit} loading={submitting} disabled={rating === 0} />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: 16, paddingBottom: 24 },
  tabRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 12, gap: 8 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabText: { fontSize: 14, fontWeight: '600' },
  tabTextActive: { color: 'white' },
  fbCard: {
    borderRadius: 12, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  fbHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fbDate: { fontSize: 12 },
  fbComment: { fontSize: 14, marginTop: 8, lineHeight: 20 },
  fbMember: { fontSize: 13, marginTop: 4, fontStyle: 'italic' },
  form: { padding: 20 },
  formLabel: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
  stars: { flexDirection: 'row', gap: 4, marginBottom: 16 },
  star: { fontSize: 32, marginRight: 2 },
});
