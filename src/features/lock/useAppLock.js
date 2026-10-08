import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { KEYS } from '../../constants/storageKeys';
import { load, save } from '../../utils/storage';
import { biometricsAvailable } from './lockStorage';

// App lock settings, and whether the app is locked right now.
export function useAppLock() {
  const [lock, setLock] = useState({ enabled: false, bio: false, delay: 0 }); // delay = ms away before relocking
  const [ready, setReady] = useState(false);
  const [locked, setLocked] = useState(true);
  const [cover, setCover] = useState(false); // blank the screen while the app is in the background
  const [bioAvailable, setBioAvailable] = useState(false);
  const leftAt = useRef(0);

  useEffect(() => {
    load(KEYS.lock).then(l => {
      if (l) setLock(l);
      setLocked(!!(l && l.enabled));
      setReady(true);
    });
    biometricsAvailable().then(setBioAvailable);
  }, []);

  const saveLock = next => {
    setLock(next);
    save(KEYS.lock, next);
  };

  // Lock again when the app has been away long enough; blank the screen while it is in the background.
  useEffect(() => {
    if (!lock.enabled) return;
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') {
        if (leftAt.current && Date.now() - leftAt.current >= lock.delay) setLocked(true);
        leftAt.current = 0;
        setCover(false);
      } else {
        if (state === 'background' && !leftAt.current) leftAt.current = Date.now();
        setCover(true);
      }
    });
    return () => sub.remove();
  }, [lock]);

  return { lock, saveLock, ready, locked, cover, bioAvailable, unlock: () => setLocked(false) };
}
