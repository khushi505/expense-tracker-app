import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../theme/ThemeContext';

// "Deleted “Lemon Soda”  UNDO" bar shown after removing an expense.
export default function UndoSnackbar({ undo, onUndo }) {
  const styles = useThemedStyles(makeStyles);
  if (!undo) return null;
  return (
    <View style={styles.snackbar}>
      <Text style={styles.text}>Deleted “{undo.item.label}”</Text>
      <Pressable onPress={onUndo} hitSlop={10}>
        <Text style={styles.action}>UNDO</Text>
      </Pressable>
    </View>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    snackbar: { position: 'absolute', left: 16, right: 92, bottom: 28, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2b2b38', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16 },
    text: { color: '#fff', fontSize: 15, flex: 1, marginRight: 12 },
    action: { color: '#ffd166', fontWeight: '700', fontSize: 15 },
  });
