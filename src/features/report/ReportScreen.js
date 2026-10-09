import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MonthBar from '../../components/MonthBar';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { makeSharedStyles } from '../../theme/sharedStyles';
import LedgerSwitch from '../ledger/LedgerSwitch';
import { buildReportHtml } from './reportHtml';
import { shareReportPdf } from './sharePdf';

// Pick a month and share it as a PDF report.
export default function ReportScreen({ ledger, onLedgerChange, month, onMonthChange, total, count, sections, budgetStatus, cats, name }) {
  const { c } = useTheme();
  const shared = useThemedStyles(makeSharedStyles);
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
    <View style={shared.panel}>
      <LedgerSwitch value={ledger.id} onChange={onLedgerChange} />
      <MonthBar month={month} onChange={onMonthChange} />
      <View style={shared.statCard}>
        <Text style={shared.statLabel}>{ledger.totalLabel}</Text>
        <Text style={shared.statValue}>{total} Rs</Text>
      </View>
      <View style={shared.statCard}>
        <Text style={shared.statLabel}>Expenses</Text>
        <Text style={shared.statValue}>{count}</Text>
      </View>
      <Pressable style={[styles.button, disabled && { opacity: 0.4 }]} onPress={share} disabled={disabled}>
        <Text style={styles.buttonText}>Share as PDF</Text>
      </Pressable>
      {count === 0 && <Text style={styles.note}>No expenses in this month yet.</Text>}
      {error && <Text style={[styles.note, { color: c.danger }]}>{error}</Text>}
      <Text style={styles.note}>The report lists every expense for the month, grouped by date, with the total and your budget.</Text>
    </View>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    button: { backgroundColor: c.accent, borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
    buttonText: { color: '#fff', fontSize: 16 },
    note: { color: c.muted, fontSize: 13, lineHeight: 18, marginTop: 14, textAlign: 'center' },
  });
