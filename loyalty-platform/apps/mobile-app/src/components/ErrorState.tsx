import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '../theme/useColors';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const colors = useColors();
  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={[styles.message, { color: colors.error }]}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={[styles.retryBtn, { backgroundColor: colors.primaryDark }]} onPress={onRetry}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  icon: { fontSize: 40, marginBottom: 12 },
  message: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  retryBtn: { marginTop: 16, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  retryText: { color: 'white', fontSize: 14, fontWeight: '600' },
});
