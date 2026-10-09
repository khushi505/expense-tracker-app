import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { makeSharedStyles } from '../../theme/sharedStyles';

// Name, the daily monthly budget, and how many entries were logged in the month being viewed (totals live on the Month overview).
export default function ProfileScreen({ name, saveName, dailyBudget, saveDailyBudget, count }) {
  const { c } = useTheme();
  const shared = useThemedStyles(makeSharedStyles);
  const styles = useThemedStyles(makeStyles);
  return (
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Text style={shared.label}>Your name</Text>
      <TextInput style={shared.input} placeholder="Enter your name" placeholderTextColor={c.muted} value={name} onChangeText={saveName} />
      <Text style={[shared.label, { marginTop: 20 }]}>Monthly budget (Rs)</Text>
      <TextInput style={shared.input} placeholder="No budget set" placeholderTextColor={c.muted} keyboardType="numeric" value={dailyBudget} onChangeText={saveDailyBudget} />
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
  });
