import React from 'react';
import { Redirect, useRootNavigationState, useSegments } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useOnboardingSessionVersion } from '@/hooks/useOnboardingSession';
import { useSupabaseSession } from '@/hooks/useSupabaseSession';
import {
  guestBootHref,
  resolveGuestBootTargetSync,
  shouldForceGuestRedirect,
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
  const hasSupabaseSession = useSupabaseSession();
  useOnboardingSessionVersion();

  if (!enabled || !rootState?.key || isLoading || isLoggedIn || hasSupabaseSession) {
    return null;
  }

  const target = resolveGuestBootTargetSync(false);

  if (!shouldForceGuestRedirect(target, segments)) {
    return null;
  }

  const href = guestBootHref(target);
  if (!href) return null;

  return <Redirect href={href as any} />;
}
