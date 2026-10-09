import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { makeSharedStyles } from '../../theme/sharedStyles';

// Name, the two monthly budgets, and a few totals.
export default function ProfileScreen({ name, saveName, dailyBudget, saveDailyBudget, houseBudget, saveHouseBudget, dailyMonthTotal, houseMonthTotal, allTotal, count }) {
  const { c } = useTheme();
  const shared = useThemedStyles(makeSharedStyles);
  const styles = useThemedStyles(makeStyles);
  return (
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Text style={shared.label}>Your name</Text>
      <TextInput style={shared.input} placeholder="Enter your name" placeholderTextColor={c.muted} value={name} onChangeText={saveName} />
      <Text style={[shared.label, { marginTop: 20 }]}>Daily budget (Rs per month)</Text>
      <TextInput style={shared.input} placeholder="No budget set" placeholderTextColor={c.muted} keyboardType="numeric" value={dailyBudget} onChangeText={saveDailyBudget} />
      <Text style={[shared.label, { marginTop: 16 }]}>House budget (Rs per month)</Text>
      <TextInput style={shared.input} placeholder="No budget set" placeholderTextColor={c.muted} keyboardType="numeric" value={houseBudget} onChangeText={saveHouseBudget} />
      <View style={shared.statCard}>
        <Text style={shared.statLabel}>Daily this month</Text>
        <Text style={shared.statValue}>{dailyMonthTotal} Rs</Text>
      </View>
      <View style={shared.statCard}>
        <Text style={shared.statLabel}>House this month</Text>
        <Text style={shared.statValue}>{houseMonthTotal} Rs</Text>
      </View>
      <View style={shared.statCard}>
        <Text style={shared.statLabel}>All time</Text>
        <Text style={shared.statValue}>{allTotal} Rs</Text>
      </View>
      <View style={shared.statCard}>
        <Text style={shared.statLabel}>Expenses logged</Text>
        <Text style={shared.statValue}>{count}</Text>
      </View>
    </ScrollView>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    content: { paddingTop: 20, paddingBottom: 24 },
  });
