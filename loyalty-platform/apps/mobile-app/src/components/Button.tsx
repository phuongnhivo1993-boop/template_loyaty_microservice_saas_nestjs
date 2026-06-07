import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useColors } from '../theme/useColors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  style?: any;
}

export default function Button({ title, onPress, variant = 'primary', loading, disabled, style }: ButtonProps) {
  const colors = useColors();
  const bg = variant === 'primary' ? colors.primaryDark : variant === 'danger' ? colors.error : colors.card;
  const textColor = variant === 'secondary' ? colors.text : 'white';
  const border = variant === 'secondary' ? colors.border : 'transparent';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, { backgroundColor: bg, borderColor: border, borderWidth: variant === 'secondary' ? 1 : 0, opacity: disabled ? 0.6 : 1 }, style]}
    >
      {loading ? <ActivityIndicator size="small" color={textColor} /> : <Text style={[styles.text, { color: textColor }]}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 16, fontWeight: '600' },
});
