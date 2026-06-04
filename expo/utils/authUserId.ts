const AUTH_USER_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Supabase auth のユーザー ID（anonymous-* 等は除外） */
export function isValidAuthUserId(id: string | null | undefined): id is string {
  return !!id && id !== 'me' && AUTH_USER_ID_RE.test(id);
}
