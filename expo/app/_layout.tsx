import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { LogBox, Platform, View, StatusBar } from "react-native";
import * as Linking from "expo-linking";
import { setupNotificationHandler } from "@/utils/notifications";
import { isOnboardingComplete } from "@/utils/onboardingStorage";

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

// スプラッシュ画面を自動で隠さないように設定
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

/** 初回起動時のみオンボーディングへ誘導（スプラッシュ完了後） */
function OnboardingGate({ splashDone }: { splashDone: boolean }) {
  const router = useRouter();
  const checked = useRef(false);

  useEffect(() => {
    if (!splashDone || checked.current) return;
    checked.current = true;
    (async () => {
      const done = await isOnboardingComplete();
      if (!done) {
        router.replace("/onboarding" as any);
      }
    })();
  }, [splashDone, router]);

  return null;
}

function RootLayoutNav() {
  const { colors, isDark } = useTheme();
  const backTitle = Platform.OS === 'ios' ? ' ' : undefined;
  const router = useRouter();

  // ディープリンク rork-app://player/:id の処理
  useEffect(() => {
    const handleUrl = (url: string) => {
      try {
        const parsed = Linking.parse(url);
        // rork-app://player/SOME_UUID
        if (parsed.scheme === 'rork-app' && parsed.hostname === 'player' && parsed.path) {
          const playerId = parsed.path.replace(/^\//, '');
          if (playerId) {
            router.push(`/player/${playerId}` as any);
          }
        }
      } catch {
        // ignore parse errors
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
  const [showSplash, setShowSplash] = useState(true);
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
    setSplashDone(true);
  }, []);

  useEffect(() => {
    // ネイティブスプラッシュを早めに隠してカスタムアニメーションを表示
    const t = setTimeout(async () => {
      await SplashScreen.hideAsync();
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
                <RootLayoutNav />
                <OnboardingGate splashDone={splashDone} />
                {showSplash && (
                  <AnimatedLogoSplash onComplete={handleSplashComplete} />
                )}
              </ThemeProvider>
            </ChessProvider>
          </LocationProvider>
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}