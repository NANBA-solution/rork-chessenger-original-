import React, { useEffect } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';

/**
 * 起動振り分け: 未登録 → オンボード（→ 登録） / 登録済み → ホーム
 */
export default function AppIndex() {
  const router = useRouter();
  const auth = useAuth();
  const isLoading = auth?.isLoading ?? true;
  const isLoggedIn = auth?.isLoggedIn ?? false;

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn) {
      router.replace('/onboarding');
      return;
    }
    router.replace('/(tabs)/(home)/search');
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
