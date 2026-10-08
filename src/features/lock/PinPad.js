import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';

export const PIN_LENGTH = 4;
const KEYS = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['', '0', '⌫']];

// Number pad that collects a PIN and calls onComplete(pin) once it is full.
export default function PinPad({ title, subtitle, error, onComplete, disabled }) {
  const { c } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [pin, setPin] = useState('');

  const press = k => {
    if (disabled) return;
    if (k === '⌫') return setPin(pin.slice(0, -1));
    if (pin.length >= PIN_LENGTH) return;
    const next = pin + k;
    setPin(next);
    if (next.length === PIN_LENGTH) {
      setTimeout(() => {
        setPin('');
        onComplete(next);
      }, 120);
    }
  };

  return (
    <View style={styles.pad}>
      <Text style={styles.title}>{title}</Text>
      <Text style={[styles.subtitle, !!error && { color: c.danger }]}>{error || subtitle || ' '}</Text>
      <View style={styles.dots}>
        {Array.from({ length: PIN_LENGTH }, (_, i) => (
          <View key={i} style={[styles.dot, pin.length > i && styles.dotOn]} />
        ))}
      </View>
      {KEYS.map((row, r) => (
        <View key={r} style={styles.row}>
          {row.map((k, i) =>
            k === '' ? (
              <View key={i} style={styles.key} />
            ) : (
              <Pressable key={i} onPress={() => press(k)} style={[styles.key, styles.keyFilled]} disabled={disabled}>
                <Text style={styles.keyText}>{k}</Text>
              </Pressable>
            )
          )}
        </View>
      ))}
    </View>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    pad: { alignItems: 'center' },
    title: { color: c.text, fontSize: 22, fontWeight: '700' },
    subtitle: { color: c.muted, fontSize: 14, marginTop: 6, marginBottom: 22, minHeight: 18 },
    dots: { flexDirection: 'row', gap: 16, marginBottom: 28 },
    dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: c.accent },
    dotOn: { backgroundColor: c.accent },
    row: { flexDirection: 'row', gap: 20, marginBottom: 14 },
    key: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
    keyFilled: { backgroundColor: c.card },
    keyText: { color: c.text, fontSize: 26, fontWeight: '500' },
  });
