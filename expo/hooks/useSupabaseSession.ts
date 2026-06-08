import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export type SupabaseSessionState = {
  /** getSession() 完了後に true（完了前の誤リダイレクト防止） */
  ready: boolean;
  hasSession: boolean;
};

/** AuthProvider の isLoggedIn 更新前でも、Supabase セッション有無を追跡する */
export function useSupabaseSession(): SupabaseSessionState {
  const [state, setState] = useState<SupabaseSessionState>({ ready: false, hasSession: false });

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      setState({ ready: true, hasSession: !!session?.user });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState((prev) => ({ ready: true, hasSession: !!session?.user }));
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return state;
}
