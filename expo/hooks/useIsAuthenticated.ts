import { useAuth } from '@/providers/AuthProvider';

/** AuthProvider の user 更新前でも Supabase セッションを含めたログイン判定 */
export function useIsAuthenticated(): boolean {
  const auth = useAuth();
  return Boolean(auth?.isLoggedIn || auth?.hasRemoteSession);
}
