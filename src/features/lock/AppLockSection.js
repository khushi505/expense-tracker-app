import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Segmented from '../../components/Segmented';
import Chevron from '../../components/Chevron';
import { useTheme, useThemedStyles } from '../../theme/ThemeContext';
import { makeSharedStyles } from '../../theme/sharedStyles';
import { getPin, savePin } from './lockStorage';
import PinPad from './PinPad';

const FLOW_TITLES = { old: 'Enter current PIN', new: 'Choose a PIN', confirm: 'Confirm your PIN' };

// App lock settings: turn it on (choosing a PIN), change the PIN, fingerprint, and when it locks.
// Calls onFlowChange(true) while the PIN pad is taking over, so the screen can hide everything else.
export default function AppLockSection({ lock, saveLock, bioAvailable, onFlowChange }) {
  const { c } = useTheme();
  const shared = useThemedStyles(makeSharedStyles);
  const styles = useThemedStyles(makeStyles);
  const [pinFlow, setPinFlow] = useState(null); // { intent, stage: 'old' | 'new' | 'confirm', first, error }

  useEffect(() => {
    if (onFlowChange) onFlowChange(!!pinFlow);
  }, [pinFlow]);

  const onPinDone = async pin => {
    const f = pinFlow;
    if (!f) return;
    if (f.stage === 'old') {
      const saved = await getPin();
      setPinFlow(pin === saved ? { ...f, stage: 'new', error: '' } : { ...f, error: 'Wrong PIN' });
    } else if (f.stage === 'new') {
      setPinFlow({ ...f, stage: 'confirm', first: pin, error: '' });
    } else if (pin === f.first) {
      try {
        await savePin(pin);
        saveLock({ ...lock, enabled: true });
        setPinFlow(null);
      } catch (e) {
        setPinFlow({ ...f, stage: 'new', first: null, error: 'Could not save the PIN' });
      }
    } else {
      setPinFlow({ ...f, stage: 'new', first: null, error: "PINs didn't match. Try again." });
    }
  };

  if (pinFlow) {
    return (
      <View>
        <View style={{ alignItems: 'center' }}>
          <PinPad title={FLOW_TITLES[pinFlow.stage]} subtitle="4 digits" error={pinFlow.error} onComplete={onPinDone} />
          <Pressable onPress={() => setPinFlow(null)} style={shared.resetBtn}>
            <Text style={shared.resetText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View>
      <Text style={shared.label}>App lock</Text>
      <Segmented
        options={[['Off', false], ['On', true]]}
        value={lock.enabled}
        onChange={on => (on ? setPinFlow({ intent: 'enable', stage: 'new' }) : saveLock({ ...lock, enabled: false, bio: false }))}
      />
      {lock.enabled && (
        <View>
          <Pressable onPress={() => setPinFlow({ intent: 'change', stage: 'old' })} style={shared.statCard}>
            <Text style={shared.statValue}>Change PIN</Text>
            <Chevron direction="right" color={c.accent} size={10} />
          </Pressable>
          <Text style={[shared.label, { marginTop: 24 }]}>Fingerprint / face unlock</Text>
          <Segmented
            options={[['Off', false], ['On', true]]}
            value={lock.bio}
            disabled={!bioAvailable}
            style={!bioAvailable && { opacity: 0.4 }}
            onChange={v => saveLock({ ...lock, bio: v })}
          />
          {!bioAvailable && <Text style={styles.note}>Set up a fingerprint or face on your phone to use this.</Text>}
          <Text style={[shared.label, { marginTop: 24 }]}>Lock when leaving the app</Text>
          <Segmented
            options={[['Immediately', 0], ['After 1 min', 60000]]}
            value={lock.delay}
            onChange={v => saveLock({ ...lock, delay: v })}
          />
        </View>
      )}
    </View>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    note: { color: c.muted, fontSize: 13, marginTop: 6 },
  });
