import { isOnboardingComplete } from '@/utils/onboardingStorage';
import { ONBOARDING_HREF, SIGNUP_LOGIN_HREF } from '@/utils/authRouting';

export type GuestBootTarget = 'loading' | 'onboarding' | 'signup' | 'home';

/** 認証状態に応じた起動先（ログイン済みはホーム、未登録はオンボード→登録） */
export async function resolveGuestBootTarget(isLoggedIn: boolean): Promise<GuestBootTarget> {
  if (isLoggedIn) return 'home';
  const done = await isOnboardingComplete();
  return done ? 'signup' : 'onboarding';
}

export function guestBootHref(target: GuestBootTarget): string | null {
  if (target === 'home') return '/(tabs)/(home)/search';
  if (target === 'onboarding') return ONBOARDING_HREF;
  if (target === 'signup') return SIGNUP_LOGIN_HREF;
  return null;
}

const GATE_EXEMPT_ROOTS = new Set([
  'onboarding',
  'login',
  'index',
  'terms-of-service',
  'privacy-policy',
  'help-support',
]);

/** 未ログイン時にオンボード/登録へ誘導しない画面 */
export function isOnboardingGateExempt(segments: string[]): boolean {
  const root = segments[0];
  if (!root) return true;
  return GATE_EXEMPT_ROOTS.has(root);
}
