import { useEffect, useState } from 'react';
import { CATEGORIES } from '../../constants/categories';
import { KEYS } from '../../constants/storageKeys';
import { lastEmoji } from '../../utils/emoji';
import { load, save } from '../../utils/storage';

// Category icons: the defaults, with any emoji the user has chosen on top.
export function useCategoryIcons(storageKey = KEYS.icons, defaults = CATEGORIES) {
  const [icons, setIcons] = useState({}); // user-chosen emoji per category; missing keys use the defaults

  useEffect(() => {
    load(storageKey).then(v => v && setIcons(v));
  }, []);

  const saveIcons = next => {
    setIcons(next);
    save(storageKey, next);
  };

  // Ignores text that has no emoji in it (letters, digits).
  const setIcon = (category, text) => {
    const emoji = lastEmoji(text);
    if (emoji) saveIcons({ ...icons, [category]: emoji });
  };

  return { cats: { ...defaults, ...icons }, custom: icons, setIcon, saveIcons, resetIcons: () => saveIcons({}) };
}
