/** ログイン済みユーザーのホーム（タブ初期画面 = 検索） */
export const HOME_HREF = '/(tabs)' as const;

/** オンボーディング完了後のログイン画面（審査用デモアカウントはログインが先） */
export const LOGIN_HREF = '/login' as const;

/** 新規登録画面（expo-router 文字列形式が最も安定） */
export const SIGNUP_LOGIN_HREF = '/login?mode=signup' as const;

/** 未登録ユーザーの起動先（オンボード → 登録の順を保つ） */
export const ONBOARDING_HREF = '/onboarding' as const;

export function isSignupMode(mode: string | string[] | undefined): boolean {
  if (mode === 'signup') return true;
  if (Array.isArray(mode)) return mode.includes('signup');
  return false;
}

/** オンボード完了後の新規登録へ（Redirect より router.replace の方がネイティブで安定） */
export function navigateToSignup(router: { replace: (href: string) => void }): void {
  router.replace({ pathname: '/login', params: { mode: 'signup' } } as never);
}

/** ログイン済みホームへ */
export function navigateToHome(router: { replace: (href: string) => void }): void {
  router.replace(HOME_HREF as never);
}
