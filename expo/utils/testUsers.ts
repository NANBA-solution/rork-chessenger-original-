/** CI/ローカル検証で作成されるデバッグ用アカウント（delete_test_users.sql と同一パターン） */
const TEST_EMAIL_RE = /^test-\d+@example\.com$/i;

export function isTestUserEmail(email: string | null | undefined): boolean {
  if (!email?.trim()) return false;
  return TEST_EMAIL_RE.test(email.trim());
}

export function isTestProfile(profile: {
  email?: string | null;
  name?: string | null;
}): boolean {
  return isTestUserEmail(profile.email);
}

export function filterOutTestProfiles<T extends { email?: string | null }>(profiles: T[]): T[] {
  return profiles.filter((p) => !isTestProfile(p));
}
