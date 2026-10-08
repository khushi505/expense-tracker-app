import AsyncStorage from '@react-native-async-storage/async-storage';

// Reads a saved value; resolves to null when nothing is saved or it can't be read.
export const load = async (key, parse = JSON.parse) => {
  try {
    const v = await AsyncStorage.getItem(key);
    return v == null ? null : parse(v);
  } catch (e) {
    return null;
  }
};

export const save = (key, value, stringify = JSON.stringify) => AsyncStorage.setItem(key, stringify(value)).catch(() => {});

// For values stored as plain text (name, budget).
export const asText = v => v;
