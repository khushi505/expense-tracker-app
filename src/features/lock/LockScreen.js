import { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text } from 'react-native';
import { useThemedStyles } from '../../theme/ThemeContext';
import { getPin, phoneUnlock } from './lockStorage';
import PinPad from './PinPad';

const MAX_TRIES = 5;
const COOLDOWN_MS = 30000;

// Shown instead of the app while it is locked.
export default function LockScreen({ bio, onUnlock }) {
  const styles = useThemedStyles(makeStyles);
  const [error, setError] = useState('');
  const [fails, setFails] = useState(0);
  const [until, setUntil] = useState(0);
  const [now, setNow] = useState(Date.now());

  const tryPhone = async () => {
    if (await phoneUnlock('Unlock Tracker')) onUnlock();
  };

  useEffect(() => {
    if (bio) tryPhone();
  }, []);

  useEffect(() => {
    if (until <= Date.now()) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [until]);

  const waiting = until > now;
  const secs = Math.ceil((until - now) / 1000);

  const check = async pin => {
    const saved = await getPin();
    if (saved && pin === saved) return onUnlock();
    const f = fails + 1;
    if (f >= MAX_TRIES) {
      setFails(0);
      setUntil(Date.now() + COOLDOWN_MS);
      setNow(Date.now());
      setError('Too many attempts');
    } else {
      setFails(f);
      setError('Wrong PIN');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <PinPad
        title="Enter PIN"
        subtitle={waiting ? `Try again in ${secs}s` : ''}
        error={waiting ? '' : error}
        onComplete={check}
        disabled={waiting}
      />
      <Pressable onPress={tryPhone} style={styles.link}>
        <Text style={styles.linkText}>{bio ? 'Use fingerprint / face' : 'Forgot PIN? Use phone lock'}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const makeStyles = c =>
  StyleSheet.create({
    screen: { flex: 1, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
    link: { marginTop: 18, padding: 8 },
    linkText: { color: c.accent, fontSize: 15, fontWeight: '600' },
  });
