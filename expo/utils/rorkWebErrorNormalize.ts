import { Platform } from 'react-native';

/** Rork 親フレームへ送る前に Error / 空オブジェクトを人が読める文字列にする */
export function normalizeErrorForBridge(error: unknown): Error {
  if (error instanceof Error && error.message) return error;

  if (typeof error === 'string' && error.trim()) {
    return new Error(error);
  }

  if (typeof error === 'object' && error !== null) {
    const rec = error as Record<string, unknown>;
    const msg = rec.message;
    if (typeof msg === 'string' && msg.trim()) return new Error(msg);
    try {
      const json = JSON.stringify(error);
      if (json && json !== '{}') return new Error(json);
    } catch {
      // ignore
    }
  }

  return new Error(
    error == null ? 'Unknown error' : String(error),
  );
}

/** @rork-ai/toolkit-sdk の console.error 転送で "{}" 表示になりにくくする */
export function installRorkWebErrorNormalize(): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;

  const wrap = () => {
    const patched = console.error;
    if ((patched as { __chessengerNormalized?: boolean }).__chessengerNormalized) return;

    console.error = (...args: unknown[]) => {
      const first = args[0];
      if (first instanceof Error || typeof first === 'string') {
        patched.apply(console, args as Parameters<typeof console.error>);
        return;
      }
      patched.call(console, normalizeErrorForBridge(first));
    };
    (console.error as { __chessengerNormalized?: boolean }).__chessengerNormalized = true;
  };

  wrap();
  queueMicrotask(wrap);
}
