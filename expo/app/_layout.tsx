import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState, useCallback } from "react";
import { LogBox, Platform, View, StatusBar } from "react-native";
import * as Linking from "expo-linking";
import { extractPlayerIdFromUrl } from "@/utils/deepLinks";
import '@/rork-error-shim';
import { installRorkWebErrorNormalize } from '@/utils/rorkWebErrorNormalize';
import { setupNotificationHandler } from '@/utils/notifications';

if (Platform.OS === 'web') {
  installRorkWebErrorNormalize();
}
setupNotificationHandler();

LogBox.ignoreLogs([
  "[SafeImage] onError",
  "Image data is nil",
  "useNativeDriver",
  /Animated:.*useNativeDriver.*/i, // web では RCTAnimation 未対応のため警告を抑制
]);
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LocationProvider } from "@/providers/LocationProvider";
import { ChessProvider } from "@/providers/ChessProvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { ThemeProvider, useTheme } from "@/providers/ThemeProvider";
import { AnimatedLogoSplash } from "@/components/AnimatedLogoSplash";
import { WebHydrationGate } from "@/components/WebHydrationGate";

// スプラッシュ画面を自動で隠さないように設定（未処理 reject だと Rork で Error message: {} になる）
void SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { colors, isDark } = useTheme();
  const backTitle = Platform.OS === 'ios' ? ' ' : undefined;
  const router = useRouter();

  // ディープリンク rork-app://player/:id の処理
  useEffect(() => {
    const handleUrl = (url: string) => {
      const playerId = extractPlayerIdFromUrl(url);
      if (playerId) {
        router.push(`/player/${playerId}` as any);
      }
    };

    // アプリが既に起動している状態でディープリンクが来た場合
    const subscription = Linking.addEventListener('url', ({ url }) => handleUrl(url));

    // アプリが閉じている状態からディープリンクで起動された場合
    Linking.getInitialURL().then(url => {
      if (url) handleUrl(url);
    }).catch(() => {});

    return () => subscription.remove();
  }, [router]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Stack
        screenOptions={{
          headerBackTitle: backTitle,
          headerTintColor: colors.textPrimary,
          headerStyle: { backgroundColor: colors.background },
          headerShadowVisible: false, // 境界線を消してスッキリさせる
          contentStyle: { backgroundColor: colors.background },
          gestureEnabled: true,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="onboarding"
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: 'fade',
          }}
        />
      </Stack>
    </View>
  );
}

export default function RootLayout() {
  // Web（Rork プレビュー）ではカスタムスプラッシュを出さない（hydration / 親フレームへの空エラー報告を避ける）
  const [showSplash, setShowSplash] = useState(Platform.OS !== 'web');
  const splashMountReady = Platform.OS !== 'web';

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  useEffect(() => {
    // ネイティブスプラッシュを早めに隠してカスタムアニメーションを表示
    const t = setTimeout(() => {
      void SplashScreen.hideAsync().catch(() => {});
    }, 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AuthProvider>
          <LocationProvider>
            <ChessProvider>
              <ThemeProvider>
                <WebHydrationGate>
                  <RootLayoutNav />
                  {showSplash && splashMountReady ? (
                    <AnimatedLogoSplash onComplete={handleSplashComplete} />
                  ) : null}
                </WebHydrationGate>
              </ThemeProvider>
            </ChessProvider>
          </LocationProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}