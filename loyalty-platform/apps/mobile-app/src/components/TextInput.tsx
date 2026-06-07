import { View, Text, TextInput as RNTextInput, StyleSheet } from 'react-native';
import { useColors } from '../theme/useColors';

interface Props {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad';
  error?: string;
  required?: boolean;
}

export default function TextInput({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, error, required }: Props) {
  const colors = useColors();
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}{required ? ' *' : ''}</Text>
      <RNTextInput
        style={[styles.input, { backgroundColor: colors.inputBg, borderColor: error ? colors.error : colors.border, color: colors.text }, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 10, padding: 14, fontSize: 15 },
  inputError: { borderColor: '#dc2626' },
  error: { fontSize: 12, marginTop: 4 },
});
