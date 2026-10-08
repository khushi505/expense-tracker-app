import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { useThemedStyles } from '../../theme/ThemeContext';
import { makeSharedStyles } from '../../theme/sharedStyles';
import BackupSection from '../backup/BackupSection';
import AppLockSection from '../lock/AppLockSection';

// One page for keeping the app private (lock) and keeping the data safe (backup and restore).
export default function SecurityBackupScreen({ lock, saveLock, bioAvailable, backup, count }) {
  const shared = useThemedStyles(makeSharedStyles);
  const styles = useThemedStyles(makeStyles);
  const [choosingPin, setChoosingPin] = useState(false); // the PIN pad takes over the whole page

  return (
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <AppLockSection lock={lock} saveLock={saveLock} bioAvailable={bioAvailable} onFlowChange={setChoosingPin} />
      {!choosingPin && (
        <>
          <Text style={shared.section}>Backup & restore</Text>
          <BackupSection backup={backup} count={count} />
        </>
      )}
    </ScrollView>
  );
}

const makeStyles = () =>
  StyleSheet.create({
    content: { paddingTop: 20, paddingBottom: 24 },
  });
