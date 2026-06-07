import { View, StyleSheet } from 'react-native';

interface Props {
  value: string;
  size?: number;
}

function generatePattern(value: string): boolean[][] {
  const size = 21;
  const matrix: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));

  for (let i = 0; i < 7; i++) {
    for (let j = 0; j < 7; j++) {
      if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
        matrix[i][j] = true;
        matrix[i][size - 1 - j] = true;
        matrix[size - 1 - i][j] = true;
      }
    }
  }

  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash) + value.charCodeAt(i);
    hash |= 0;
  }

  let seed = Math.abs(hash);
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (matrix[i][j]) continue;
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      matrix[i][j] = seed % 2 === 0;
    }
  }

  return matrix;
}

export default function QRCode({ value, size = 200 }: Props) {
  const matrix = generatePattern(value);
  const cellSize = size / matrix.length;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {matrix.map((row, i) => (
        <View key={i} style={styles.row}>
          {row.map((cell, j) => (
            <View
              key={j}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: cell ? '#1e293b' : '#ffffff',
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { overflow: 'hidden', borderRadius: 8 },
  row: { flexDirection: 'row' },
});
