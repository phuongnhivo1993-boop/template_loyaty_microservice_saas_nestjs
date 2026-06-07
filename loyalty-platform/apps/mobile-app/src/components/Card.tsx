import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useColors } from '../theme/useColors';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  title?: string;
}

export default function Card({ children, style, title }: CardProps) {
  const colors = useColors();
  return (
    <View style={[styles.card, { backgroundColor: colors.card }, style]}>
      {title && <Text style={[styles.title, { color: colors.text }]}>{title}</Text>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
});
