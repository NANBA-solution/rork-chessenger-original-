import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useOnboardingSessionVersion } from '@/hooks/useOnboardingSession';
import { useIsAuthenticated } from '@/hooks/useIsAuthenticated';
import { useSupabaseSession } from '@/hooks/useSupabaseSession';
import { HOME_HREF } from '@/utils/authRouting';
import {
  guestBootHref,
  resolveGuestBootTargetSync,
  type GuestBootTarget,
} from '@/utils/onboardingRouting';

type Props = {
  /** この画面が正しい起動先のときはリダイレクトしない */
  expectedTarget?: 'onboarding' | 'signup';
};

/**
 * 未ログイン時の起動先をオンボード or 新規登録に固定する。
 * Redirect ではなく router.replace を使い、起動直後の 404 フラッシュを防ぐ。
 */
export function GuestBootRedirect({ expectedTarget }: Props) {
  const auth = useAuth();
  const router = useRouter();
  const rootState = useRootNavigationState();
  const isLoading = auth?.isLoading ?? true;
  const isAuthenticated = useIsAuthenticated();
  const { ready: sessionReady } = useSupabaseSession();
  useOnboardingSessionVersion();

  const navigationReady = Boolean(rootState?.key);
  const authReady = !isLoading && (isAuthenticated || sessionReady);

  const target: GuestBootTarget = resolveGuestBootTargetSync(isAuthenticated);
  const shouldStayOnScreen = Boolean(
    expectedTarget && !isAuthenticated && target === expectedTarget,
  );

  useEffect(() => {
    if (!navigationReady || !authReady) return;
    if (shouldStayOnScreen) return;

    if (isAuthenticated) {
      router.replace(HOME_HREF as never);
      return;
    }

    const href = guestBootHref(target);
    if (href) {
      router.replace(href as never);
    }
  }, [
    navigationReady,
    authReady,
    shouldStayOnScreen,
    isAuthenticated,
    target,
    router,
  ]);

  if (shouldStayOnScreen) {
    return null;
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ActivityIndicator size="large" color="#7C3AED" />
    </View>
  );
}
