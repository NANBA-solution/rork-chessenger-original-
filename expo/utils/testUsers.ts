import type { Player } from '@/types';

/** 審査用デモアカウント（一覧から除外しない） */
export const REVIEW_DEMO_EMAIL = 'chessenger.co.ltd@gmail.com';

/** 明らかな捨てアドレス */
const DISPOSABLE_EMAIL_RES: RegExp[] = [
  /^test-\d+@example\.com$/i,
  /^t@t\.com$/i,
  /@example\.com$/i,
  /@test\.com$/i,
  /^test@/i,
  /^test\+/i,
];

/** 名前だけでテストと分かる表示名 */
const TEST_NAME_RE = /^test$/i;

export function isReviewDemoEmail(email: string | null | undefined): boolean {
  return (email ?? '').trim().toLowerCase() === REVIEW_DEMO_EMAIL;
}

export function isTestUserEmail(email: string | null | undefined): boolean {
  if (!email?.trim()) return false;
  if (isReviewDemoEmail(email)) return false;
  return DISPOSABLE_EMAIL_RES.some((re) => re.test(email.trim()));
}

export function isTestDisplayName(name: string | null | undefined): boolean {
  return TEST_NAME_RE.test((name ?? '').trim());
}

export function isTestProfile(profile: {
  email?: string | null;
  name?: string | null;
}): boolean {
  if (isReviewDemoEmail(profile.email)) return false;
  if (isTestUserEmail(profile.email)) return true;
  if (isTestDisplayName(profile.name)) return true;
  return false;
}

/** 登録拒否理由（null なら OK） */
export function getTestRegistrationBlockReason(
  email: string,
  name: string,
): string | null {
  if (isReviewDemoEmail(email)) return null;
  if (isTestUserEmail(email)) {
    return 'このメールアドレスでは登録できません';
  }
  if (isTestDisplayName(name)) {
    return 'このユーザー名では登録できません';
  }
  return null;
}

export function filterOutTestProfiles<
  T extends { email?: string | null; name?: string | null },
>(profiles: T[]): T[] {
  return profiles.filter((p) => !isTestProfile(p));
}

/** Player 型（email なし）の最終ガード */
export function filterVisiblePlayers(players: Player[]): Player[] {
  return players.filter((p) => !isTestDisplayName(p.name));
}
