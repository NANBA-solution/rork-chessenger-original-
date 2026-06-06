import React, { useEffect } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { isOnboardingComplete } from '@/utils/onboardingStorage';
import { SIGNUP_LOGIN_HREF } from '@/utils/authRouting';
import { useAuth } from '@/providers/AuthProvider';

/**
 * 起動振り分け: 未オンボード → オンボード / 未登録 → 登録 / 登録済み → ホーム
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
      if (isLoggedIn) {
        router.replace('/(tabs)/(home)/search');
        return;
      }
      const done = await isOnboardingComplete();
      if (cancelled) return;
      router.replace(done ? (SIGNUP_LOGIN_HREF as any) : '/onboarding');
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
