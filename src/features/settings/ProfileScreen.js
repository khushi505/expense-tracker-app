import { Text, TextInput, View } from 'react-native';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { makeSharedStyles } from '../../theme/sharedStyles';

// Name, monthly budget, and a few totals.
export default function ProfileScreen({ name, saveName, budget, saveBudget, monthTotal, allTotal, count }) {
  const { c } = useTheme();
  const shared = useThemedStyles(makeSharedStyles);
  return (
    <View style={shared.panel}>
      <Text style={shared.label}>Your name</Text>
      <TextInput style={shared.input} placeholder="Enter your name" placeholderTextColor={c.muted} value={name} onChangeText={saveName} />
      <Text style={[shared.label, { marginTop: 20 }]}>Monthly budget (Rs)</Text>
      <TextInput style={shared.input} placeholder="No budget set" placeholderTextColor={c.muted} keyboardType="numeric" value={budget} onChangeText={saveBudget} />
      <View style={shared.statCard}>
        <Text style={shared.statLabel}>This month</Text>
        <Text style={shared.statValue}>{monthTotal} Rs</Text>
      </View>
      <View style={shared.statCard}>
        <Text style={shared.statLabel}>All time</Text>
        <Text style={shared.statValue}>{allTotal} Rs</Text>
      </View>
      <View style={shared.statCard}>
        <Text style={shared.statLabel}>Expenses logged</Text>
        <Text style={shared.statValue}>{count}</Text>
      </View>
    </View>
  );
}
