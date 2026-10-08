import { useEffect, useState } from 'react';
import { KEYS } from '../../constants/storageKeys';
import { asText, load, save } from '../../utils/storage';

// The user's name (shown at the top of the menu).
export function useProfile() {
  const [name, setName] = useState('');

  useEffect(() => {
    load(KEYS.profile, asText).then(v => v && setName(v));
  }, []);

  const saveName = v => {
    setName(v);
    save(KEYS.profile, v, asText);
  };

  return { name, saveName };
}
