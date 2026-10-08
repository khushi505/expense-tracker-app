import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { KEYS } from '../constants/storageKeys';
import { load, save } from '../utils/storage';
import { ACCENTS, PALETTES } from './palettes';

const ThemeContext = createContext(null);

// Holds the light/dark mode and accent colour, and saves the user's choice.
export function ThemeProvider({ children }) {
  const system = useColorScheme();
  const [mode, setMode] = useState(null); // null = follow the phone's setting until the user picks
  const [accent, setAccent] = useState(ACCENTS[0]);

  useEffect(() => {
    load(KEYS.theme).then(t => {
      if (t) {
        setMode(t.mode ?? null);
        setAccent(t.accent);
      }
    });
  }, []);

  const value = useMemo(() => {
    const saveTheme = (nextMode, nextAccent) => {
      setMode(nextMode);
      setAccent(nextAccent);
      save(KEYS.theme, { mode: nextMode, accent: nextAccent });
    };
    return { c: { ...PALETTES[mode || system || 'light'], accent }, isDark: (mode || system) === 'dark', mode, accent, saveTheme };
  }, [mode, system, accent]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);

// Builds a component's styles from the current colours (rebuilt only when the theme changes).
export function useThemedStyles(makeStyles) {
  const { c } = useTheme();
  return useMemo(() => makeStyles(c), [c]);
}
