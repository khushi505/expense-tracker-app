import { File, Paths } from 'expo-file-system';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const base64ToBytes = b64 => {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
};

// Turns the report page into a PDF and opens the phone's share sheet.
export async function shareReportPdf({ html, month }) {
  if (!(await Sharing.isAvailableAsync())) throw new Error("This phone can't share files.");
  const { uri, base64 } = await Print.printToFileAsync({ html, width: 595, height: 842, base64: true }); // A4

  // Sharing is only allowed from the app's own folder, so save the PDF there under a readable name.
  const file = new File(Paths.cache, `expense-report-${month}.pdf`);
  if (file.exists) file.delete();
  file.create();
  file.write(base64ToBytes(base64));
  try {
    new File(uri).delete(); // tidy up the print engine's temporary copy
  } catch (e) {}

  await Sharing.shareAsync(file.uri, { mimeType: 'application/pdf', dialogTitle: 'Share monthly report', UTI: 'com.adobe.pdf' });
}
