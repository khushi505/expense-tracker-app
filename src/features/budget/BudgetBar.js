import { StyleSheet, Text, View } from 'react-native';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';

// Progress bar and "X Rs left of Y Rs" line. Amounts are masked while the total is hidden.
export default function BudgetBar({ total, status, hidden }) {
  const { c } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const { hasBudget, budgetNum, left, over } = status;
  if (!hasBudget) return null;
  return (
    <View style={styles.budget}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.min(total / budgetNum, 1) * 100}%` }, over && { backgroundColor: c.danger }]} />
      </View>
      <Text style={[styles.text, over && !hidden && { color: c.danger }]}>
        {hidden ? (over ? 'Over budget' : 'Budget on track') : over ? `Over budget by ${-left} Rs` : `${left} Rs left of ${budgetNum} Rs`}
      </Text>
    </View>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    budget: { marginBottom: 6 },
    track: { height: 8, borderRadius: 4, backgroundColor: c.border, overflow: 'hidden' },
    fill: { height: 8, borderRadius: 4, backgroundColor: c.accent },
    text: { color: c.muted, fontSize: 13, marginTop: 6 },
  });
