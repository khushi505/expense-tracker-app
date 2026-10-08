import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MonthBar from '../../components/MonthBar';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { makeSharedStyles } from '../../theme/sharedStyles';
import { dateLabel } from '../../utils/dates';
import Calendar from './Calendar';

// Pick a day, a category icon, then type what you spent and how much. Also used to edit an entry.
export default function AddExpenseScreen({ month, date, onSelectDate, onMonthChange, markedDays, cats, form, onSave, onDelete }) {
  const { c } = useTheme();
  const shared = useThemedStyles(makeSharedStyles);
  const styles = useThemedStyles(makeStyles);
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        <MonthBar month={month} onChange={onMonthChange} />
        <View style={{ marginTop: 8 }}>
          <Calendar month={month} date={date} onSelect={onSelectDate} markedDays={markedDays} />
        </View>
        <Text style={styles.date}>{dateLabel(date)}</Text>

        <View style={styles.categories}>
          {Object.entries(cats).map(([k, icon]) => (
            <Pressable key={k} onPress={() => form.setCategory(form.category === k ? null : k)} style={[styles.catItem, form.category === k && styles.catActive]}>
              <Text style={styles.catIcon}>{icon}</Text>
            </Pressable>
          ))}
        </View>

        <TextInput style={shared.input} placeholder="Spent on…" placeholderTextColor={c.muted} value={form.label} onChangeText={form.setLabel} />
        <TextInput style={[shared.input, { marginTop: 10 }]} placeholder="Amount" placeholderTextColor={c.muted} keyboardType="numeric" value={form.amount} onChangeText={form.setAmount} />

        <Pressable style={[styles.saveBtn, !form.canSave && { opacity: 0.4 }]} onPress={onSave}>
          <Text style={styles.saveText}>{form.editingId ? 'Save changes' : 'Add expense'}</Text>
        </Pressable>
        {form.editingId && (
          <Pressable style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.deleteText}>Delete expense</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    date: { color: c.muted, marginTop: 6, marginBottom: 10, fontSize: 13, textAlign: 'center' },
    categories: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    catItem: { width: 40, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: c.card, borderWidth: 2, borderColor: 'transparent' },
    catActive: { borderColor: c.accent },
    catIcon: { fontSize: 18 },
    saveBtn: { backgroundColor: c.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
    saveText: { color: '#fff', fontSize: 16 },
    deleteBtn: { alignItems: 'center', paddingVertical: 14, marginTop: 8 },
    deleteText: { color: c.danger, fontSize: 16, fontWeight: '600' },
  });
