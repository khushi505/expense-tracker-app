import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { dateKey } from '../../utils/dates';

// Writes the backup to a file and opens the phone's share sheet (save to Drive, WhatsApp, email...).
export async function shareBackupFile(backup) {
  if (!(await Sharing.isAvailableAsync())) throw new Error("This phone can't share files.");
  const file = new File(Paths.cache, `tracker-backup-${dateKey(new Date())}.json`);
  if (file.exists) file.delete();
  file.create();
  file.write(JSON.stringify(backup, null, 2));
  await Sharing.shareAsync(file.uri, { mimeType: 'application/json', dialogTitle: 'Save your backup', UTI: 'public.json' });
}

// Lets the user pick a file and returns its text, or null if they cancelled.
export async function pickBackupText() {
  const picked = await File.pickFileAsync({ mimeTypes: ['application/json', 'text/plain', '*/*'] });
  if (picked.canceled) return null;
  return picked.result.text();
}
