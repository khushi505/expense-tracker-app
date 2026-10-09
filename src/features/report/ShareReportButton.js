import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { buildReportHtml } from './reportHtml';
import { shareReportPdf } from './sharePdf';

// "Share as PDF" for the month being shown in the list. Disabled when the month has no entries.
export default function ShareReportButton({ ledger, month, name, total, count, sections, budgetStatus, cats }) {
  const { c } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const share = async () => {
    setBusy(true);
    setError(null);
    try {
      const html = buildReportHtml({ month, name, reportName: ledger.reportName, total, count, sections, budgetStatus, cats, accent: c.accent });
      await shareReportPdf({ html, month, prefix: ledger.filePrefix });
    } catch (e) {
      setError(e.message || 'Could not create the report.');
    }
    setBusy(false);
  };

  const disabled = busy || count === 0;
  return (
    <View>
      <Pressable style={[styles.button, disabled && { opacity: 0.4 }]} onPress={share} disabled={disabled}>
        <Text style={styles.text}>Share as PDF</Text>
      </Pressable>
      {error && <Text style={[styles.error, { color: c.danger }]}>{error}</Text>}
    </View>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    button: { borderWidth: 1.5, borderColor: c.accent, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 14 },
    text: { color: c.accent, fontSize: 14, fontWeight: '600' },
    error: { fontSize: 12, marginTop: 4, textAlign: 'right' },
  });
