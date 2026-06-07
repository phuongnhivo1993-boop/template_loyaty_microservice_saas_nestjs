import { Modal as RNModal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useColors } from '../theme/useColors';

interface Props {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ visible, title, onClose, children }: Props) {
  const colors = useColors();
  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.content, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            <TouchableOpacity onPress={onClose}><Text style={[styles.close, { color: colors.textSecondary }]}>✕</Text></TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  content: { borderRadius: 16, padding: 24, width: '100%', maxWidth: 400 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '700' },
  close: { fontSize: 20, padding: 4 },
});
