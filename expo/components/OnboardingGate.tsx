import React, { useEffect, useState } from 'react';
import { Redirect, useRootNavigationState, useSegments } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import {
  guestBootHref,
  isOnboardingGateExempt,
  resolveGuestBootTarget,
  type GuestBootTarget,
} from '@/utils/onboardingRouting';

/**
 * ディープリンクやタブ直開きでも未登録ユーザーをオンボードへ戻すグローバルガード。
 */
export function OnboardingGate({ enabled }: { enabled: boolean }) {
  const auth = useAuth();
  const segments = useSegments();
  const rootState = useRootNavigationState();
  const isLoading = auth?.isLoading ?? true;
  const isLoggedIn = auth?.isLoggedIn ?? false;
  const [target, setTarget] = useState<GuestBootTarget | 'pass'>('pass');

  useEffect(() => {
    if (!enabled || !rootState?.key || isLoading) return;
    if (isLoggedIn || isOnboardingGateExempt(segments)) {
      setTarget('pass');
      return;
    }

    let cancelled = false;
    void (async () => {
      const next = await resolveGuestBootTarget(false);
      if (!cancelled) setTarget(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [enabled, rootState?.key, isLoading, isLoggedIn, segments]);

  if (target === 'pass' || target === 'loading' || target === 'home') {
    return null;
  }

  const href = guestBootHref(target);
  if (!href) return null;

  return <Redirect href={href as any} />;
}
