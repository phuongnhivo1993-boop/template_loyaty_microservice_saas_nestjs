import { StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';

export function useThemedStyles<T extends StyleSheet.NamedStyles<T>>(
  factory: (colors: ReturnType<typeof useTheme>['colors']) => T
) {
  const { colors } = useTheme();
  return StyleSheet.create(factory(colors));
}
