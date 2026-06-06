import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { guestBootHref, resolveGuestBootTarget, type GuestBootTarget } from '@/utils/onboardingRouting';

/**
 * 起動振り分け: 未オンボード → オンボード / 未登録 → 登録 / 登録済み → ホーム
 */
export default function AppIndex() {
  const auth = useAuth();
  const isLoading = auth?.isLoading ?? true;
  const isLoggedIn = auth?.isLoggedIn ?? false;
  const [target, setTarget] = useState<GuestBootTarget>('loading');

  useEffect(() => {
    if (isLoading) return;

    let cancelled = false;
    void (async () => {
      const next = await resolveGuestBootTarget(isLoggedIn);
      if (!cancelled) setTarget(next);
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoading, isLoggedIn]);

  if (isLoading || target === 'loading') {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Platform.OS === 'web' ? '#F7F8FC' : undefined,
        }}
      >
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  const href = guestBootHref(target);
  if (!href) {
    return (
      <View style={{ flex: 1, backgroundColor: Platform.OS === 'web' ? '#F7F8FC' : undefined }} />
    );
  }

  return <Redirect href={href as any} />;
}
