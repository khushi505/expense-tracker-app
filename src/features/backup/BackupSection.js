import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { makeSharedStyles } from '../../theme/sharedStyles';
import { dateLabel } from '../../utils/dates';

// Back up to a file you can keep anywhere, and restore from one.
export default function BackupSection({ backup, count }) {
  const { c } = useTheme();
  const shared = useThemedStyles(makeSharedStyles);
  const styles = useThemedStyles(makeStyles);
  const { backUp, restore, busy, message, lastBackup } = backup;
  return (
    <View>
      <Text style={styles.intro}>Your expenses are stored only on this phone. A backup file lets you move them to a new phone or recover them if this one is lost.</Text>

      <View style={shared.statCard}>
        <Text style={shared.statLabel}>Expenses</Text>
        <Text style={shared.statValue}>{count}</Text>
      </View>
      <View style={shared.statCard}>
        <Text style={shared.statLabel}>Last backup</Text>
        <Text style={shared.statValue}>{lastBackup ? dateLabel(lastBackup) : 'Never'}</Text>
      </View>

      <Pressable style={[styles.primary, busy && { opacity: 0.5 }]} onPress={backUp} disabled={busy}>
        <Text style={styles.primaryText}>Back up now</Text>
      </Pressable>
      <Pressable style={[styles.secondary, busy && { opacity: 0.5 }]} onPress={restore} disabled={busy}>
        <Text style={styles.secondaryText}>Restore from a backup file</Text>
      </Pressable>

      {message && <Text style={[styles.message, message.error && { color: c.danger }]}>{message.text}</Text>}

      <Text style={styles.note}>The file includes your expenses and settings. It does not include your PIN or app-lock settings. Keep it private, since anyone with the file can read your expenses.</Text>
    </View>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    intro: { color: c.muted, fontSize: 14, lineHeight: 20, marginBottom: 8 },
    primary: { backgroundColor: c.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
    primaryText: { color: '#fff', fontSize: 16 },
    secondary: { borderWidth: 1.5, borderColor: c.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 12 },
    secondaryText: { color: c.accent, fontSize: 16, fontWeight: '600' },
    message: { color: c.text, fontSize: 14, marginTop: 16, textAlign: 'center' },
    note: { color: c.muted, fontSize: 12, lineHeight: 17, marginTop: 24 },
  });
