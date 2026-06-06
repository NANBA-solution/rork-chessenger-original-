import React, { useEffect, useState } from 'react';
import { Redirect, useRootNavigationState, useSegments } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import {
  guestBootHref,
  resolveGuestBootTarget,
  shouldForceGuestRedirect,
  type GuestBootTarget,
} from '@/utils/onboardingRouting';

/**
 * タブ直開き・ディープリンクでも未登録ユーザーをオンボード/登録へ戻す。
 */
export function OnboardingGate({ enabled }: { enabled: boolean }) {
  const auth = useAuth();
  const segments = useSegments();
  const rootState = useRootNavigationState();
  const isLoading = auth?.isLoading ?? true;
  const isLoggedIn = auth?.isLoggedIn ?? false;
  const [target, setTarget] = useState<GuestBootTarget>('loading');

  useEffect(() => {
    if (!enabled || !rootState?.key || isLoading) return;

    if (isLoggedIn) {
      setTarget('home');
      return;
    }

    let cancelled = false;
    setTarget('loading');
    void (async () => {
      const next = await resolveGuestBootTarget(false);
      if (!cancelled) setTarget(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, rootState?.key, isLoading, isLoggedIn]);

  if (!enabled || isLoading || target === 'loading' || target === 'home') {
    return null;
  }

  if (!shouldForceGuestRedirect(target, segments)) {
    return null;
  }

  const href = guestBootHref(target);
  if (!href) return null;

  return <Redirect href={href as any} />;
}
