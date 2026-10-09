import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme, useThemedStyles } from '../theme/ThemeContext';

const ITEMS = [['home', 'Home'], ['profile', 'Profile'], ['appearance', 'Appearance'], ['overview', 'Month overview'], ['security', 'Security & backup']];

// Side menu opened by ☰.
export default function MenuDrawer({ visible, onClose, name, screen, onSelect }) {
  const { c } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
        <View style={styles.drawer}>
          <Text style={styles.name}>{name || 'Menu'}</Text>
          {ITEMS.map(([k, text]) => (
            <Pressable key={k} onPress={() => onSelect(k)} style={styles.item}>
              <Text style={[styles.itemText, screen === k && { color: c.accent, fontWeight: '700' }]}>{text}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    overlay: { flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.45)' },
    drawer: { width: 240, backgroundColor: c.card, paddingTop: 48, paddingHorizontal: 20 },
    name: { fontSize: 20, fontWeight: '700', color: c.text, marginBottom: 20 },
    item: { paddingVertical: 14 },
    itemText: { fontSize: 18, color: c.text },
  });
