import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { Store } from '../services/types';

export default function StoreDetailScreen() {
  const route = useRoute<any>();
  const { store } = route.params as { store: Store };

  const callStore = () => {
    if (store.phone) {
      Linking.openURL(`tel:${store.phone}`);
    }
  };

  const openMap = () => {
    const { lat, lng, address } = store;
    if (lat && lng) {
      const url = Platform.OS === 'ios'
        ? `maps://app?daddr=${lat},${lng}`
        : `geo:${lat},${lng}?q=${encodeURIComponent(address)}`;
      Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>🏪</Text>
          </View>
          <Text style={styles.name}>{store.name}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.rowIcon}>📍</Text>
            <View style={styles.rowContent}>
              <Text style={styles.rowLabel}>Address</Text>
              <Text style={styles.rowValue}>{store.address}</Text>
            </View>
          </View>

          {store.phone && (
            <TouchableOpacity style={styles.row} onPress={callStore}>
              <Text style={styles.rowIcon}>📞</Text>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Phone</Text>
                <Text style={[styles.rowValue, styles.linkText]}>{store.phone}</Text>
              </View>
            </TouchableOpacity>
          )}

          {store.hours && (
            <View style={styles.row}>
              <Text style={styles.rowIcon}>🕐</Text>
              <View style={styles.rowContent}>
                <Text style={styles.rowLabel}>Hours</Text>
                <Text style={styles.rowValue}>{store.hours}</Text>
              </View>
            </View>
          )}
        </View>

        {store.lat && store.lng && (
          <TouchableOpacity style={styles.mapButton} onPress={openMap}>
            <Text style={styles.mapButtonIcon}>🗺️</Text>
            <Text style={styles.mapButtonText}>Open in Maps</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: 'center', padding: 32, paddingBottom: 24 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0f2fe',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  iconText: { fontSize: 36 },
  name: { fontSize: 24, fontWeight: '800', color: '#1e293b', textAlign: 'center' },
  section: { backgroundColor: 'white', marginHorizontal: 16, borderRadius: 14, padding: 6, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  row: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  rowIcon: { fontSize: 20, marginRight: 14, width: 28, textAlign: 'center' },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 12, fontWeight: '600', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  rowValue: { fontSize: 16, color: '#1e293b' },
  linkText: { color: '#2563eb', fontWeight: '600' },
  mapButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginHorizontal: 16, marginTop: 24, padding: 16,
    backgroundColor: '#2563eb', borderRadius: 14,
  },
  mapButtonIcon: { fontSize: 20, marginRight: 8 },
  mapButtonText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
