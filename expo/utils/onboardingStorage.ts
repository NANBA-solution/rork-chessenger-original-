import AsyncStorage from '@react-native-async-storage/async-storage';

/** 永続化しない。アプリ再起動のたびにオンボードを出す（未登録ユーザー向け） */
let guestOnboardingDoneThisSession = false;

const LEGACY_ONBOARDING_KEYS = [
  'chess_onboarding_seen_v4',
  'chess_onboarding_seen_v3',
  'chess_onboarding_seen_v2',
  'chess_onboarding_complete',
] as const;

/** この起動セッションでオンボードを完了したか（永続化しない） */
export async function isOnboardingComplete(): Promise<boolean> {
  return guestOnboardingDoneThisSession;
}

/** オンボード完了（同一セッション内のみ有効。次回起動では再表示） */
export async function completeOnboarding(): Promise<void> {
  guestOnboardingDoneThisSession = true;
  try {
    await AsyncStorage.multiRemove([...LEGACY_ONBOARDING_KEYS]);
  } catch {
    // ignore
  }
}

/** ログアウト時など: オンボードを再度表示する */
export async function resetOnboarding(): Promise<void> {
  guestOnboardingDoneThisSession = false;
  try {
    await AsyncStorage.multiRemove([...LEGACY_ONBOARDING_KEYS]);
  } catch {
    // ignore
  }
}
