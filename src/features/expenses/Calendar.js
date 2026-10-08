import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../../theme/ThemeContext';
import { WEEKDAYS, daysIn, pad } from '../../utils/dates';

// Month grid: tap a day to pick it. A dot marks days that already have expenses.
export default function Calendar({ month, date, onSelect, markedDays }) {
  const styles = useThemedStyles(makeStyles);
  const lead = new Date(+month.slice(0, 4), +month.slice(5) - 1, 1).getDay();
  const cells = [...Array(lead).fill(null), ...Array.from({ length: daysIn(month) }, (_, i) => i + 1)];

  return (
    <View style={styles.calendar}>
      <View style={styles.week}>
        {WEEKDAYS.map((w, i) => <Text key={i} style={styles.weekday}>{w}</Text>)}
      </View>
      <View style={styles.week}>
        {cells.map((n, i) => {
          if (!n) return <View key={i} style={styles.cell} />;
          const key = `${month}-${pad(n)}`;
          const selected = key === date;
          return (
            <View key={i} style={styles.cell}>
              <Pressable onPress={() => onSelect(key)} android_ripple={null} style={[styles.dayCircle, selected && styles.daySelected]}>
                <Text style={[styles.dayText, selected && styles.dayTextSelected]}>{n}</Text>
              </Pressable>
              <View style={[styles.dot, markedDays[key] && styles.dotOn]} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    calendar: { backgroundColor: c.card, borderRadius: 10, paddingTop: 10, paddingBottom: 4, paddingHorizontal: 6, marginBottom: 4 },
    week: { flexDirection: 'row', flexWrap: 'wrap' },
    weekday: { width: '14.2857%', textAlign: 'center', color: c.muted, fontSize: 11, paddingBottom: 2 },
    cell: { width: '14.2857%', alignItems: 'center', paddingVertical: 0 },
    dayCircle: { width: 27, height: 27, borderRadius: 13.5, overflow: 'hidden', alignItems: 'center', justifyContent: 'center', outlineStyle: 'none' },
    daySelected: { backgroundColor: c.accent },
    dayText: { fontSize: 13, color: c.text },
    dayTextSelected: { color: '#fff', fontWeight: '700' },
    dot: { width: 4, height: 4, borderRadius: 2, marginTop: 0, marginBottom: 1 },
    dotOn: { backgroundColor: c.accent },
  });
