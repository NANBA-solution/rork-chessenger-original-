/** オンボーディング完了後の新規登録画面（expo-router 文字列形式が最も安定） */
export const SIGNUP_LOGIN_HREF = '/login?mode=signup' as const;

/** 未登録ユーザーの起動先（オンボード → 登録の順を保つ） */
export const ONBOARDING_HREF = '/onboarding' as const;

export function isSignupMode(mode: string | string[] | undefined): boolean {
  if (mode === 'signup') return true;
  if (Array.isArray(mode)) return mode.includes('signup');
  return false;
}
