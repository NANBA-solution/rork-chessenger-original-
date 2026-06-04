import { Platform } from 'react-native';
import { SUPPORTED_LANGUAGES, type Language } from '@/utils/translations';

const LANGUAGE_KEY = 'chess_language';
const supportedCodes = new Set(SUPPORTED_LANGUAGES.map((l) => l.code));

/** Web では初回描画前に localStorage から同期読み（hydration #418 対策） */
export function getInitialAppLanguage(): Language {
  if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem(LANGUAGE_KEY);
      if (stored && supportedCodes.has(stored)) return stored;
    } catch {
      // ignore
    }
  }
  return 'en';
}
