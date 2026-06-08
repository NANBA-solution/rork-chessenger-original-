import { isOnboardingComplete, isOnboardingCompleteSync } from '@/utils/onboardingStorage';
import { LOGIN_HREF, ONBOARDING_HREF } from '@/utils/authRouting';

export type GuestBootTarget = 'loading' | 'onboarding' | 'signup' | 'home';

/** 認証状態に応じた起動先（ログイン済みはホーム、未登録は毎回オンボード→同一セッション内のみ登録） */
export function resolveGuestBootTargetSync(isLoggedIn: boolean): GuestBootTarget {
  if (isLoggedIn) return 'home';
  return isOnboardingCompleteSync() ? 'signup' : 'onboarding';
}

export async function resolveGuestBootTarget(isLoggedIn: boolean): Promise<GuestBootTarget> {
  if (isLoggedIn) return 'home';
  const done = await isOnboardingComplete();
  return done ? 'signup' : 'onboarding';
}

export function guestBootHref(target: GuestBootTarget): string | null {
  if (target === 'home') return '/(tabs)/(home)/search';
  if (target === 'onboarding') return ONBOARDING_HREF;
  if (target === 'signup') return LOGIN_HREF;
  return null;
}

function guestDestinationRoot(target: GuestBootTarget): string | null {
  if (target === 'onboarding') return 'onboarding';
  if (target === 'signup') return 'login';
  return null;
}

/** 未ログイン時、現在の画面が本来いるべき起動先と違うか */
export function shouldForceGuestRedirect(
  target: GuestBootTarget,
  segments: string[],
): boolean {
  if (target === 'loading' || target === 'home') return false;
  const expected = guestDestinationRoot(target);
  if (!expected) return false;
  const root = segments[0] ?? '';
  // オンボード画面の遷移は OnboardingScreen 自身に任せる（ゲートと競合させない）
  if (root === 'onboarding') return false;
  return root !== expected;
}
