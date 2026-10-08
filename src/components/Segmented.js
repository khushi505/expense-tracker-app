import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../theme/ThemeContext';

// A row of choices where one is active. options = [[label, value], ...]
export default function Segmented({ options, value, onChange, disabled, style }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={[styles.segment, style]}>
      {options.map(([text, v]) => (
        <Pressable key={text} disabled={disabled} onPress={() => onChange(v)} style={[styles.item, value === v && styles.active]}>
          <Text style={[styles.text, value === v && styles.textActive]}>{text}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    segment: { flexDirection: 'row', backgroundColor: c.card, borderRadius: 10, padding: 4 },
    item: { flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
    active: { backgroundColor: c.accent },
    text: { color: c.text, fontSize: 15 },
    textActive: { color: '#fff', fontWeight: '700' },
  });
