import { Platform } from 'react-native';

/** Rork 親フレームへ送る前に Error / 空オブジェクトを人が読める文字列にする */
export function normalizeErrorForBridge(error: unknown): Error {
  if (error instanceof Error && error.message?.trim()) return error;

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

  return new Error(error == null ? 'Unknown error' : String(error));
}

/** @rork-ai/toolkit-sdk の console.error 上書き後もラップを維持 */
export function installRorkWebErrorNormalize(): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;

  const attach = () => {
    let inner: (...args: unknown[]) => void = (...args) => {
      // eslint-disable-next-line no-console
      (console.log as (...a: unknown[]) => void)(...args);
    };

    const wrap = (...args: unknown[]) => {
      const out = args.map((a) => {
        if (a instanceof Error) {
          return a.message?.trim() ? a : new Error(a.stack || a.name || 'Error');
        }
        if (typeof a === 'string') return a;
        return normalizeErrorForBridge(a);
      });
      inner(...out);
    };

    try {
      Object.defineProperty(console, 'error', {
        configurable: true,
        get: () => wrap,
        set: (fn: (...args: unknown[]) => void) => {
          inner = fn;
        },
      });
    } catch {
      // shim が既に設定済み
    }
  };

  attach();
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(attach);
  }
  setTimeout(attach, 0);
  setTimeout(attach, 100);
}
