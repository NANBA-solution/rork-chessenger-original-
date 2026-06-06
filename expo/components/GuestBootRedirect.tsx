import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import {
  guestBootHref,
  resolveGuestBootTarget,
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
  const [target, setTarget] = useState<GuestBootTarget>('loading');

  useEffect(() => {
    if (isLoading) return;

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
  }, [isLoading, isLoggedIn]);

  if (isLoading || target === 'loading') {
    // オンボード/ログイン画面は自前のUIを出す（子として埋め込まれたときに固まらないよう）
    if (expectedTarget) return null;
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  if (isLoggedIn) {
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
