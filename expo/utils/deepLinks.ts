import * as Linking from 'expo-linking';

const PLAYER_URL_RE = /(?:^|\/)player\/([^/?#]+)/i;
const RORK_PLAYER_RE = /^rork-app:\/\/player\/([^/?#]+)/i;

/** rork-app:// / https:// / expo-router 形式からプレイヤー ID を抽出 */
export function extractPlayerIdFromUrl(url: string): string | null {
  if (!url?.trim()) return null;

  const rork = url.match(RORK_PLAYER_RE);
  if (rork?.[1]) return rork[1];

  try {
    const parsed = Linking.parse(url);
    if (parsed.hostname === 'player') {
      const fromPath = parsed.path?.replace(/^\//, '').split('/')[0];
      if (fromPath) return fromPath;
    }
    const path = parsed.path ?? '';
    const fromPath = path.match(PLAYER_URL_RE);
    if (fromPath?.[1]) return fromPath[1];
  } catch {
    // fall through
  }

  const generic = url.match(PLAYER_URL_RE);
  return generic?.[1] ?? null;
}

/** +native-intent / システムパス用 */
export function normalizeSystemPath(path: string): string {
  const trimmed = (path ?? '').trim();
  if (!trimmed || trimmed === '/') return '/';

  const player = trimmed.match(PLAYER_URL_RE);
  if (player?.[1]) return `/player/${player[1]}`;

  return trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
}
