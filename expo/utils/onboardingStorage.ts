import AsyncStorage from '@react-native-async-storage/async-storage';

/** v3: 旧キーは移行しない（テスター・審査用にオンボードを再表示できるようにする） */
export const ONBOARDING_COMPLETE_KEY = 'chess_onboarding_seen_v3';
const LEGACY_ONBOARDING_KEYS = ['chess_onboarding_seen_v2', 'chess_onboarding_complete'] as const;

export async function isOnboardingComplete(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_COMPLETE_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function completeOnboarding(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, 'true');
    await AsyncStorage.multiRemove([...LEGACY_ONBOARDING_KEYS]);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(msg || 'Failed to save onboarding state');
  }
}

/** 開発・確認用: 初回フローをやり直す */
export async function resetOnboarding(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([ONBOARDING_COMPLETE_KEY, ...LEGACY_ONBOARDING_KEYS]);
  } catch {
    // ignore
  }
}
