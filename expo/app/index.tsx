import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Redirect } from 'expo-router';
import { isOnboardingComplete } from '@/utils/onboardingStorage';

type BootTarget = 'loading' | 'onboarding' | 'tabs';

/**
 * 初回起動の振り分け。tabs を先にマウントせず、オンボーディング未完了なら onboarding へ。
 */
export default function AppIndex() {
  const [target, setTarget] = useState<BootTarget>('loading');

  useEffect(() => {
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
  }, []);

  if (target === 'loading') {
    return <View style={{ flex: 1 }} />;
  }
  if (target === 'onboarding') {
    return <Redirect href="/onboarding" />;
  }
  return <Redirect href="/(tabs)" />;
}
