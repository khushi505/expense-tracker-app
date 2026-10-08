import { Pressable, StyleSheet, Text } from 'react-native';
import { useThemedStyles } from '../theme/ThemeContext';

// Round "+" button (bottom right) that opens the add-expense screen.
export default function Fab({ onPress }) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable style={styles.fab} onPress={onPress} accessibilityLabel="Add expense">
      <Text style={styles.plus}>+</Text>
    </Pressable>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    fab: { position: 'absolute', right: 20, bottom: 28, width: 56, height: 56, borderRadius: 28, backgroundColor: c.accent, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
    plus: { color: '#fff', fontSize: 32, lineHeight: 36, fontWeight: '300' },
  });
