import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';
import Chevron from './Chevron';

// Top bar: optional back arrow, screen title, and the ☰ menu button.
export default function Header({ title, showBack, onBack, onMenu }) {
  const { c } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={styles.header}>
      {showBack ? (
        <Pressable onPress={onBack} style={styles.back} accessibilityLabel="Back">
          <Chevron direction="left" color={c.accent} size={14} />
        </Pressable>
      ) : null}
      <Text style={[styles.title, { flex: 1 }]}>{title}</Text>
      <Pressable onPress={onMenu} hitSlop={12} accessibilityLabel="Menu">
        <Text style={styles.menuIcon}>☰</Text>
      </Pressable>
    </View>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    title: { fontSize: 22, fontWeight: '700', color: c.text },
    menuIcon: { fontSize: 24, color: c.text },
    back: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center', marginRight: 4, marginLeft: -6 },
  });
