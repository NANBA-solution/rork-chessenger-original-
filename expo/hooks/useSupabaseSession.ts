import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

/** AuthProvider の isLoggedIn 更新前でも、Supabase セッション有無を同期的に追跡する */
export function useSupabaseSession(): boolean {
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) setHasSession(!!session?.user);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session?.user);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return hasSession;
}
