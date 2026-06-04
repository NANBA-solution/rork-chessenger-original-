import React, { useEffect, useRef } from 'react';
import { View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { isOnboardingComplete } from '@/utils/onboardingStorage';

/**
 * 初回起動の振り分け。Redirect ではなく replace で hydration 不一致を避ける。
 */
export default function AppIndex() {
  const router = useRouter();
  const routed = useRef(false);

  useEffect(() => {
    if (routed.current) return;
    let cancelled = false;
    void (async () => {
      try {
        const done = await isOnboardingComplete();
        if (cancelled || routed.current) return;
        routed.current = true;
        if (done) {
          router.replace('/(tabs)/(home)/search');
        } else {
          router.replace('/onboarding');
        }
      } catch {
        if (!cancelled && !routed.current) {
          routed.current = true;
          router.replace('/onboarding');
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return <View style={{ flex: 1, backgroundColor: Platform.OS === 'web' ? '#F7F8FC' : undefined }} />;
}
