import { useAuth } from '@/providers/AuthProvider';

export type SupabaseSessionState = {
  ready: boolean;
  hasSession: boolean;
};

/** AuthProvider のセッション状態を参照（重複 getSession を避ける） */
export function useSupabaseSession(): SupabaseSessionState {
  const auth = useAuth();
  return {
    ready: auth?.authBootstrapped ?? false,
    hasSession: auth?.hasRemoteSession ?? false,
  };
}
