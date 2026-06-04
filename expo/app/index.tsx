import React, { useEffect, useState } from 'react';
import { View, Platform } from 'react-native';
import { Redirect } from 'expo-router';
import { isOnboardingComplete } from '@/utils/onboardingStorage';

type BootTarget = 'loading' | 'onboarding' | 'tabs';

/**
 * 初回起動の振り分け。Web では hydration 前に Redirect しない（React #418 対策）。
 */
export default function AppIndex() {
  const [clientReady, setClientReady] = useState(Platform.OS !== 'web');
  const [target, setTarget] = useState<BootTarget>('loading');

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    if (!clientReady) return;
    let cancelled = false;
    void (async () => {
      try {
        const done = await isOnboardingComplete();
        if (!cancelled) setTarget(done ? 'tabs' : 'onboarding');
      } catch {
        if (!cancelled) setTarget('onboarding');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [clientReady]);

  if (!clientReady || target === 'loading') {
    return <View style={{ flex: 1 }} />;
  }
  if (target === 'onboarding') {
    return <Redirect href="/onboarding" />;
  }
  return <Redirect href="/(tabs)/(home)" />;
}
