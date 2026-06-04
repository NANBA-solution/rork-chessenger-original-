import React, { useEffect, useState } from 'react';
import { View, Platform, ActivityIndicator } from 'react-native';

/** Web: SSR とクライアント初回描画の不一致（React #418）を避ける */
export function WebHydrationGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(Platform.OS !== 'web');

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F7F8FC',
        }}
      >
        <ActivityIndicator size="large" color="#7C3AED" />
      </View>
    );
  }

  return <>{children}</>;
}
