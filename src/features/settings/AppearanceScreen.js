import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Segmented from '../../components/Segmented';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { ACCENTS } from '../../theme/palettes';
import { makeSharedStyles } from '../../theme/sharedStyles';
import CategoryIconsSection from './CategoryIconsSection';

// Light / dark mode, accent colour, and the emoji for each category.
export default function AppearanceScreen({ cats, setIcon, resetIcons }) {
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
      <Text style={shared.section}>Category icons</Text>
      <CategoryIconsSection cats={cats} setIcon={setIcon} resetIcons={resetIcons} />
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
