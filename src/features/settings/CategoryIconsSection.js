import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useThemedStyles } from '../../theme/ThemeContext';
import { makeSharedStyles } from '../../theme/sharedStyles';

// Change the emoji shown for each of a ledger's fixed categories. `names` maps category key -> label.
export default function CategoryIconsSection({ names, cats, setIcon, resetIcons }) {
  const shared = useThemedStyles(makeSharedStyles);
  const styles = useThemedStyles(makeStyles);
  return (
    <View>
      <Text style={shared.label}>Tap a box and pick an emoji from your keyboard</Text>
      {Object.keys(names).map(k => (
        <View key={k} style={styles.row}>
          <Text style={styles.name}>{names[k]}</Text>
          <TextInput style={styles.input} value={cats[k]} onChangeText={v => setIcon(k, v)} selectTextOnFocus />
        </View>
      ))}
      <Pressable onPress={resetIcons} style={shared.resetBtn}>
        <Text style={shared.resetText}>Reset to defaults</Text>
      </Pressable>
    </View>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: c.card, borderRadius: 12, paddingVertical: 8, paddingHorizontal: 16, marginTop: 8 },
    name: { color: c.text, fontSize: 16 },
    input: { width: 56, height: 48, textAlign: 'center', textAlignVertical: 'center', fontSize: 22, lineHeight: 30, paddingVertical: 0, includeFontPadding: false, borderWidth: 1, borderColor: c.border, borderRadius: 10, color: c.text },
  });
