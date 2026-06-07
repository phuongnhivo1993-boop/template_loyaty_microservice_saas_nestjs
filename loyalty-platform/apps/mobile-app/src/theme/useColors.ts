import { useTheme } from './ThemeContext';

export function useColors() {
  return useTheme().colors;
}
