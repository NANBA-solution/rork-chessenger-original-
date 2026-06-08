import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useOnboardingSessionVersion } from '@/hooks/useOnboardingSession';
import { useSupabaseSession } from '@/hooks/useSupabaseSession';
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
 */
export function GuestBootRedirect({ expectedTarget }: Props) {
  const auth = useAuth();
  const isLoading = auth?.isLoading ?? true;
  const isLoggedIn = auth?.isLoggedIn ?? false;
  const { ready: sessionReady, hasSession: hasSupabaseSession } = useSupabaseSession();
  const isAuthenticated = isLoggedIn || hasSupabaseSession;
  useOnboardingSessionVersion();
  const [authReady, setAuthReady] = useState(!isLoading);

  useEffect(() => {
    if (!isLoading) setAuthReady(true);
  }, [isLoading]);

  if (!authReady || isLoading || (!isAuthenticated && !sessionReady)) {
    if (expectedTarget) return null;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const target: GuestBootTarget = resolveGuestBootTargetSync(isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/(home)/search" />;
  }

  if (expectedTarget && target === expectedTarget) {
    return null;
  }

  if (expectedTarget && target !== expectedTarget) {
    const href = guestBootHref(target);
    if (href) return <Redirect href={href as any} />;
  }

  if (!expectedTarget) {
    const href = guestBootHref(target);
    if (href) return <Redirect href={href as any} />;
  }

  return null;
}
