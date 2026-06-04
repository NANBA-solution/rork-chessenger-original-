import AsyncStorage from '@react-native-async-storage/async-storage';

export const ONBOARDING_COMPLETE_KEY = 'chess_onboarding_complete';
/** 設定からガイドを確認済み（確認後は設定の行を非表示） */
export const ONBOARDING_SETTINGS_REVIEWED_KEY = 'chess_onboarding_settings_reviewed';

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
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(msg || 'Failed to save onboarding state');
  }
}

export async function isOnboardingReviewedFromSettings(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(ONBOARDING_SETTINGS_REVIEWED_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function markOnboardingReviewedFromSettings(): Promise<void> {
  try {
    await AsyncStorage.setItem(ONBOARDING_SETTINGS_REVIEWED_KEY, 'true');
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(msg || 'Failed to save onboarding settings review');
  }
}
