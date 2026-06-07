import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColors } from '../theme/useColors';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export default function Header({ title, subtitle, onBack, rightAction }: HeaderProps) {
  const colors = useColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <View style={styles.left}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={[styles.backText, { color: colors.headerText }]}>←</Text>
          </TouchableOpacity>
        )}
        <View>
          <Text style={[styles.title, { color: colors.headerText }]}>{title}</Text>
          {subtitle && <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      {rightAction && <View>{rightAction}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { padding: 4 },
  backText: { fontSize: 24, fontWeight: '600' },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 13, marginTop: 2 },
});
