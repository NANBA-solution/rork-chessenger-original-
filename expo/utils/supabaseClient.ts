import 'react-native-url-polyfill/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

function sanitizeEnvValue(value: string): string {
  return value.trim().replace(/^["']|["']$/g, '');
}

function resolveSupabaseUrl(): string {
  const fromEnv = sanitizeEnvValue(process.env.EXPO_PUBLIC_SUPABASE_URL ?? '');
  if (fromEnv) return fromEnv;
  return sanitizeEnvValue(String(Constants.expoConfig?.extra?.supabaseUrl ?? ''));
}

function resolveSupabaseAnonKey(): string {
  const fromEnv = sanitizeEnvValue(process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '');
  if (fromEnv) return fromEnv;
  return sanitizeEnvValue(String(Constants.expoConfig?.extra?.supabaseAnonKey ?? ''));
}

const SUPABASE_URL = resolveSupabaseUrl();
const SUPABASE_ANON_KEY = resolveSupabaseAnonKey();

export function isSupabaseConfigured(): boolean {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY;
}

/** エラー表示用（ホストのみ・秘密情報なし） */
export function getSupabaseHostForDebug(): string {
  const m = SUPABASE_URL.match(/^https?:\/\/([^/]+)/i);
  return m?.[1] ?? '(not configured)';
}

function ensureSupabaseConfig(): void {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    const missing = [!SUPABASE_URL && 'EXPO_PUBLIC_SUPABASE_URL', !SUPABASE_ANON_KEY && 'EXPO_PUBLIC_SUPABASE_ANON_KEY']
      .filter(Boolean)
      .join(', ');
    throw new Error(
      `Supabase の設定がありません。プロジェクトルートに .env を作成し、${missing} を設定してください。\n` +
        '例: .env.example を .env にコピーして値を編集\n' +
        '設定後はアプリを再起動（npx expo start -c）してください。'
    );
  }
}

declare global {
  var _supabaseSingleton: SupabaseClient | undefined;
}

if (!global._supabaseSingleton) {
  ensureSupabaseConfig();
  global._supabaseSingleton = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      ...(Platform.OS !== 'web' ? { storage: AsyncStorage } : {}),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
      lockAcquireTimeout: 60000,
    },
    realtime: {
      params: { eventsPerSecond: 5 },
    },
  });
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    const u = SUPABASE_URL ? `${SUPABASE_URL.slice(0, 30)}...` : '(missing)';
    const k = SUPABASE_ANON_KEY ? `set (${SUPABASE_ANON_KEY.slice(0, 8)}...)` : '(missing)';
    console.log('supabaseClient: URL=', u, 'ANON_KEY=', k);
  }
}

export const supabase = global._supabaseSingleton!;
export const supabaseNoAuth = global._supabaseSingleton!;

/** ログイン前の接続確認（秘密情報は送らない） */
export async function probeSupabaseConnectivity(): Promise<{ ok: boolean; detail?: string }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, detail: 'not configured' };
  }
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(`${SUPABASE_URL}/auth/v1/health`, {
      method: 'GET',
      headers: { apikey: SUPABASE_ANON_KEY },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.status === 401 || res.ok) return { ok: true };
    return { ok: false, detail: `HTTP ${res.status}` };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, detail: msg };
  }
}

export async function debugSession(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    console.log('debugSession: JWT present, user=' + session.user.id + ' expires=' + session.expires_at);
  } else {
    console.log('debugSession: NO session — requests will use anon role');
  }
}

export async function clearStaleSession(): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        const msg = error?.message ?? '';
        const isRefreshTokenInvalid =
          msg.includes('Invalid Refresh Token') ||
          msg.includes('Refresh Token Not Found') ||
          msg.includes('AuthApiError');
        console.log('clearStaleSession: stale session detected', isRefreshTokenInvalid ? '(Invalid Refresh Token)' : '', '- signing out locally');
        await supabase.auth.signOut({ scope: 'local' });
      }
    }
  } catch (e) {
    console.log('clearStaleSession error (non-blocking):', e);
  }
}
