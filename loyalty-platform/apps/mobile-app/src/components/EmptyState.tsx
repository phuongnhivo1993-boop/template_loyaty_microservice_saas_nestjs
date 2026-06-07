import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '../theme/useColors';

interface EmptyStateProps {
  message: string;
  icon?: string;
}

export default function EmptyState({ message, icon = '📭' }: EmptyStateProps) {
  const colors = useColors();
  return (
    <View style={styles.center}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  icon: { fontSize: 48, marginBottom: 12 },
  message: { fontSize: 15, textAlign: 'center' },
});
