import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const PIN_KEY = 'app_pin';

// The PIN lives in the phone's secure storage, not in the app's ordinary data.
export const getPin = () => SecureStore.getItemAsync(PIN_KEY).catch(() => null);
export const savePin = pin => SecureStore.setItemAsync(PIN_KEY, pin);

export async function biometricsAvailable() {
  try {
    return (await LocalAuthentication.hasHardwareAsync()) && (await LocalAuthentication.isEnrolledAsync());
  } catch (e) {
    return false;
  }
}

// Fingerprint / face prompt; the phone's own screen lock works as the fallback.
export async function phoneUnlock(message) {
  try {
    const r = await LocalAuthentication.authenticateAsync({ promptMessage: message });
    return !!r.success;
  } catch (e) {
    return false;
  }
}
