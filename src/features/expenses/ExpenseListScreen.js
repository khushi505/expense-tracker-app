import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../../theme/ThemeContext';
import { dateLabel, monthLabel } from '../../utils/dates';

// The chosen month's expenses grouped by date (the month is picked on the home screen). Tap an entry to edit or delete it.
export default function ExpenseListScreen({ month, total, sections, cats, onEdit }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={{ flex: 1 }}>
      <Text style={styles.month}>{monthLabel(month)}</Text>
      <Text style={styles.total}>Total: {total} Rs</Text>
      <SectionList
        sections={sections}
        keyExtractor={e => e.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={<Text style={styles.empty}>No expenses this month. Tap + to add one.</Text>}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{dateLabel(section.date)}</Text>
            <Text style={styles.sectionTotal}>{section.total} Rs</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Pressable style={styles.row} onPress={() => onEdit(item)}>
            {item.category && cats[item.category] ? <Text style={styles.rowIcon}>{cats[item.category]}</Text> : null}
            <Text style={styles.rowText}>{item.label} - {item.amount} Rs</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    month: { fontSize: 18, fontWeight: '600', color: c.text, marginTop: 14 },
    total: { color: c.muted, marginBottom: 6, marginTop: 4 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, marginBottom: 6, paddingHorizontal: 4 },
    sectionTitle: { color: c.muted, fontWeight: '600' },
    sectionTotal: { color: c.muted },
    row: { flexDirection: 'row', alignItems: 'center', backgroundColor: c.card, padding: 14, borderRadius: 12, marginBottom: 8 },
    rowIcon: { fontSize: 18, marginRight: 10 },
    rowText: { fontSize: 17, color: c.text },
    empty: { textAlign: 'center', color: c.muted, marginTop: 32 },
  });
