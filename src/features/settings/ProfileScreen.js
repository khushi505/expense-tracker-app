import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import MonthBar from '../../components/MonthBar';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { makeSharedStyles } from '../../theme/sharedStyles';
import { monthLabel } from '../../utils/dates';

// One box for an amount that is entered separately for each month, with a shortcut to copy an earlier month's.
function MonthlyField({ label, placeholder, amount, month }) {
  const { c } = useTheme();
  const shared = useThemedStyles(makeSharedStyles);
  const styles = useThemedStyles(makeStyles);
  const text = amount.textFor(month);
  const prev = text === '' ? amount.previous(month) : null;
  return (
    <View>
      <Text style={[shared.label, { marginTop: 20 }]}>{label}</Text>
      <TextInput style={shared.input} placeholder={placeholder} placeholderTextColor={c.muted} keyboardType="numeric" value={text} onChangeText={t => amount.set(month, t)} />
      {prev && (
        <Pressable onPress={() => amount.set(month, String(prev.value))} hitSlop={8}>
          <Text style={styles.copy}>Use {monthLabel(prev.month)}'s: {prev.value} Rs</Text>
        </Pressable>
      )}
    </View>
  );
}

// Name, then the amounts for one month (salary, daily budget, savings target), and how many entries were logged that month.
export default function ProfileScreen({ name, saveName, month, onMonthChange, salary, dailyBudget, savingsTarget, count }) {
  const { c } = useTheme();
  const shared = useThemedStyles(makeSharedStyles);
  const styles = useThemedStyles(makeStyles);
  return (
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Text style={shared.label}>Your name</Text>
      <TextInput style={shared.input} placeholder="Enter your name" placeholderTextColor={c.muted} value={name} onChangeText={saveName} />

      <View style={{ marginTop: 16 }}>
        <MonthBar month={month} onChange={onMonthChange} />
      </View>
      <MonthlyField label="In-hand salary (Rs)" placeholder="No salary set" amount={salary} month={month} />
      <MonthlyField label="Monthly daily budget (Rs)" placeholder="No budget set" amount={dailyBudget} month={month} />
      <MonthlyField label="Target monthly savings (Rs)" placeholder="No target set" amount={savingsTarget} month={month} />

      <Text style={[shared.label, { marginTop: 20 }]}>Logged this month</Text>
      <View style={shared.input}>
        <Text style={styles.countText}>{count}</Text>
      </View>
    </ScrollView>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    content: { paddingTop: 20, paddingBottom: 24 },
    countText: { color: c.text, fontSize: 16 },
    copy: { color: c.accent, fontSize: 13, marginTop: 8, fontWeight: '600' },
  });
