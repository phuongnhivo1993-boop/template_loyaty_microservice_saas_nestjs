import { View, StyleSheet } from 'react-native';
import QRCodeEncoder from '../lib/qrcode-encoder';

interface Props {
  value: string;
  size?: number;
}

export default function QRCode({ value, size = 200 }: Props) {
  if (!value) return null;

  const qr = QRCodeEncoder(0, 'M');
  qr.addData(value);
  qr.make();

  const moduleCount = qr.getModuleCount();
  const cellSize = size / (moduleCount + 4);
  const margin = 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={{ position: 'absolute', top: 0, left: 0, width: size, height: size, backgroundColor: '#ffffff' }} />
      {Array.from({ length: moduleCount }, (_, r) => (
        <View key={r} style={{ flexDirection: 'row', position: 'absolute', top: (r + margin) * cellSize, left: margin * cellSize }}>
          {Array.from({ length: moduleCount }, (_, c) => (
            <View
              key={c}
              style={{
                width: cellSize,
                height: cellSize,
                backgroundColor: qr.isDark(r, c) ? '#000000' : '#ffffff',
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
});
