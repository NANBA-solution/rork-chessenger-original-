/**
 * Rork Web プレビュー専用: toolkit-sdk より先に読み込み、空の {} エラー表示を防ぐ。
 * ネイティブでは window があっても addEventListener が無い → 起動クラッシュの原因になるため実行しない。
 */
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  const nativeConsoleError: typeof console.error = console.error.bind(console);

  function coerceToError(value: unknown): Error {
    if (value instanceof Error) {
      if (value.message?.trim()) return value;
      return new Error(value.stack?.split('\n')[0] || value.name || 'Error');
    }
    if (typeof value === 'string' && value.trim()) return new Error(value);
    if (typeof value === 'object' && value !== null) {
      const rec = value as Record<string, unknown>;
      const msg = rec.message;
      if (typeof msg === 'string' && msg.trim()) return new Error(msg);
      try {
        const json = JSON.stringify(value);
        if (json && json !== '{}') return new Error(json);
      } catch {
        // ignore
      }
    }
    if (value == null) return new Error('Unknown error');
    return new Error(String(value));
  }

  function normalizeArgs(args: unknown[]): unknown[] {
    return args.map((a) => {
      if (a instanceof Error) {
        return a.message?.trim() ? a : coerceToError(a);
      }
      if (typeof a === 'string') return a;
      if (typeof a === 'object' && a !== null) {
        const keys = Object.keys(a as object);
        if (keys.length === 0) return new Error('Empty error object');
        return coerceToError(a);
      }
      return a;
    });
  }

  let downstream: (...args: unknown[]) => void = nativeConsoleError;

  const wrappedConsoleError = (...args: unknown[]) => {
    downstream(...normalizeArgs(args));
  };

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      const r = event.reason;
      if (
        r != null &&
        typeof r === 'object' &&
        !(r instanceof Error) &&
        Object.keys(r as object).length === 0
      ) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      if (r != null && typeof r === 'object' && !(r instanceof Error)) {
        try {
          (event as PromiseRejectionEvent & { reason?: unknown }).reason =
            coerceToError(r);
        } catch {
          // ignore
        }
      }
    },
    true,
  );

  window.addEventListener(
    'error',
    (event) => {
      if (event.error == null && event.message) {
        try {
          (event as ErrorEvent & { error?: Error }).error = new Error(event.message);
        } catch {
          // ignore
        }
      } else if (event.error != null && !(event.error instanceof Error)) {
        try {
          (event as ErrorEvent & { error?: Error }).error = coerceToError(event.error);
        } catch {
          // ignore
        }
      }
    },
    true,
  );

  try {
    Object.defineProperty(console, 'error', {
      configurable: true,
      get: () => wrappedConsoleError,
      set: (fn: (...args: unknown[]) => void) => {
        downstream = (...args: unknown[]) => fn(...normalizeArgs(args));
      },
    });
  } catch {
    // ignore
  }
}
