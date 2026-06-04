import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { isOnboardingComplete } from '@/utils/onboardingStorage';
import { useAuth } from '@/providers/AuthProvider';

/**
 * 初回起動の振り分け。Redirect ではなく replace で hydration 不一致を避ける。
 */
export default function AppIndex() {
  const router = useRouter();
  const { isLoading } = useAuth();
  const routed = useRef(false);

  useEffect(() => {
    if (isLoading) return;

    let cancelled = false;
    void (async () => {
      try {
        const done = await isOnboardingComplete();
        if (cancelled) return;
        if (done) {
          router.replace('/(tabs)/(home)/search');
        } else {
          router.replace('/onboarding');
        }
      } catch {
        if (!cancelled) {
          router.replace('/onboarding');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoading, router]);

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
