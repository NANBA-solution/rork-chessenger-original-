/** 審査用デモアカウント（一覧から除外しない） */
const REVIEW_DEMO_EMAIL = 'chessenger.co.ltd@gmail.com';

/** CI/ローカル検証: test-123@example.com */
const TEST_EMAIL_NUMERIC_RE = /^test-\d+@example\.com$/i;

/** 明らかな捨てアドレス */
const DISPOSABLE_EMAIL_RES: RegExp[] = [
  TEST_EMAIL_NUMERIC_RE,
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
  const normalized = email.trim();
  return DISPOSABLE_EMAIL_RES.some((re) => re.test(normalized));
}

export function isTestProfile(profile: {
  email?: string | null;
  name?: string | null;
}): boolean {
  if (isReviewDemoEmail(profile.email)) return false;
  if (isTestUserEmail(profile.email)) return true;
  const name = profile.name?.trim();
  if (name && TEST_NAME_RE.test(name)) return true;
  return false;
}

export function filterOutTestProfiles<
  T extends { email?: string | null; name?: string | null },
>(profiles: T[]): T[] {
  return profiles.filter((p) => !isTestProfile(p));
}
