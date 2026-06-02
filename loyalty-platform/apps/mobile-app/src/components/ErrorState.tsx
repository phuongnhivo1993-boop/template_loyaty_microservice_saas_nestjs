import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <View style={styles.center}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 20 },
  icon: { fontSize: 40, marginBottom: 12 },
  message: { color: '#dc2626', fontSize: 16, textAlign: 'center', lineHeight: 24 },
  retryBtn: { marginTop: 16, paddingVertical: 10, paddingHorizontal: 24, backgroundColor: '#2563eb', borderRadius: 8 },
  retryText: { color: 'white', fontSize: 14, fontWeight: '600' },
});
