import { StyleSheet } from 'react-native';

// Styles used by several screens (settings pages, forms).
export const makeSharedStyles = c =>
  StyleSheet.create({
    panel: { paddingTop: 20 },
    label: { color: c.muted, marginBottom: 8, fontWeight: '600' },
    input: { backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 10, padding: 12, fontSize: 16, color: c.text },
    statCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: c.card, borderRadius: 12, padding: 16, marginTop: 12 },
    statLabel: { color: c.muted, fontSize: 16 },
    statValue: { color: c.text, fontSize: 16, fontWeight: '600' },
    section: { color: c.text, fontSize: 18, fontWeight: '700', marginTop: 32, marginBottom: 10 },
    resetBtn: { alignSelf: 'center', marginTop: 20, padding: 8 },
    resetText: { color: c.accent, fontSize: 15, fontWeight: '600' },
  });
