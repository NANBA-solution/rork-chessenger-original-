import React, { useEffect } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { isOnboardingComplete } from '@/utils/onboardingStorage';
import { SIGNUP_LOGIN_HREF } from '@/utils/authRouting';
import { useAuth } from '@/providers/AuthProvider';

/**
 * 起動振り分け: 未オンボード → オンボード → 新規登録 / 登録済み → ホーム
 */
export default function AppIndex() {
  const router = useRouter();
  const auth = useAuth();
  const isLoading = auth?.isLoading ?? true;
  const isLoggedIn = auth?.isLoggedIn ?? false;

  useEffect(() => {
    if (isLoading) return;

    let cancelled = false;
    void (async () => {
      try {
        const done = await isOnboardingComplete();
        if (cancelled) return;
        if (!done) {
          router.replace('/onboarding');
        } else if (!isLoggedIn) {
          router.replace(SIGNUP_LOGIN_HREF as any);
        } else {
          router.replace('/(tabs)/(home)/search');
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
  }, [isLoading, isLoggedIn, router]);

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
