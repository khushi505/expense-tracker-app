import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Segmented from '../../components/Segmented';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { ACCENTS } from '../../theme/palettes';
import { makeSharedStyles } from '../../theme/sharedStyles';
import CategoryIconsSection from './CategoryIconsSection';

// Light / dark mode, accent colour, and the emoji for each category (daily and house).
export default function AppearanceScreen({ ledgers }) {
  const { mode, accent, saveTheme } = useTheme();
  const shared = useThemedStyles(makeSharedStyles);
  const styles = useThemedStyles(makeStyles);
  return (
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
      <Text style={shared.label}>Mode</Text>
      <Segmented options={[['System', null], ['Light', 'light'], ['Dark', 'dark']]} value={mode} onChange={m => saveTheme(m, accent)} />
      <Text style={[shared.label, { marginTop: 24 }]}>Colour</Text>
      <View style={styles.swatches}>
        {ACCENTS.map(a => (
          <Pressable key={a} onPress={() => saveTheme(mode, a)} style={[styles.swatch, { backgroundColor: a }, a === accent && styles.swatchActive]}>
            {a === accent && <Text style={styles.check}>✓</Text>}
          </Pressable>
        ))}
      </View>
      {ledgers.map(l => (
        <View key={l.def.id}>
          <Text style={shared.section}>{l.def.id === 'daily' ? 'Category icons' : 'House icons'}</Text>
          <CategoryIconsSection names={l.def.names} cats={l.icons.cats} setIcon={l.icons.setIcon} resetIcons={l.icons.resetIcons} />
        </View>
      ))}
    </ScrollView>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    content: { paddingTop: 20, paddingBottom: 24 },
    swatches: { flexDirection: 'row', gap: 14 },
    swatch: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'transparent' },
    swatchActive: { borderColor: c.text },
    check: { color: '#fff', fontSize: 18, fontWeight: '700' },
  });
