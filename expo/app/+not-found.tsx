import { Redirect, useRootNavigationState } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "@/providers/AuthProvider";
import { useIsAuthenticated } from "@/hooks/useIsAuthenticated";
import { HOME_HREF } from "@/utils/authRouting";

/**
 * 無効ルートに到達しても 404 UI は出さず、起動完了後に正しい画面へ戻す。
 */
export default function NotFoundScreen() {
  const auth = useAuth();
  const rootState = useRootNavigationState();
  const isAuthenticated = useIsAuthenticated();

  const booting =
    !rootState?.key ||
    (auth?.isLoading ?? true) ||
    !(auth?.authBootstrapped ?? false);

  if (booting) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return <Redirect href={isAuthenticated ? HOME_HREF : "/"} />;
}
