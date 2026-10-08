import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import Chevron from './Chevron';
import { monthLabel, shiftMonth } from '../utils/dates';

// ‹ October 2026 › — moves one month at a time.
export default function MonthBar({ month, onChange }) {
  const { c } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.bar}>
      <Pressable onPress={() => onChange(shiftMonth(month, -1))} style={styles.arrow} accessibilityLabel="Previous month">
        <Chevron direction="left" color={c.accent} />
      </Pressable>
      <Text style={styles.title}>{monthLabel(month)}</Text>
      <Pressable onPress={() => onChange(shiftMonth(month, 1))} style={styles.arrow} accessibilityLabel="Next month">
        <Chevron direction="right" color={c.accent} />
      </Pressable>
    </View>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: c.card, borderRadius: 12, paddingVertical: 4, paddingHorizontal: 8, marginTop: 6 },
    title: { fontSize: 18, fontWeight: '600', color: c.text },
    arrow: { width: 48, height: 40, alignItems: 'center', justifyContent: 'center' },
  });
