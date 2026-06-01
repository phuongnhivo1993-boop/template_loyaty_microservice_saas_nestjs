import { View, Text, StyleSheet } from 'react-native';

export default function BadgesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Badges</Text>
      <Text style={styles.subtitle}>Your earned badges will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#1e293b' },
  subtitle: { fontSize: 14, color: '#64748b', marginTop: 8, textAlign: 'center' },
});
