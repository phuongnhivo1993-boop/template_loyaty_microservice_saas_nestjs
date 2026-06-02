import { View, Text, StyleSheet } from 'react-native';

interface EmptyStateProps {
  message: string;
  icon?: string;
}

export default function EmptyState({ message, icon = '📭' }: EmptyStateProps) {
  return (
    <View style={styles.center}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  icon: { fontSize: 48, marginBottom: 12 },
  message: { fontSize: 15, color: '#94a3b8', textAlign: 'center' },
});
