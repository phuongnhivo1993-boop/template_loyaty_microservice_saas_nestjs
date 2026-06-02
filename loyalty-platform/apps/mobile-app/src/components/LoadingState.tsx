import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message }: LoadingStateProps) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#2563eb" />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  message: { marginTop: 12, fontSize: 14, color: '#64748b' },
});
