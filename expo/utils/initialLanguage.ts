import type { Language } from '@/utils/translations';

/**
 * SSR / クライアント初回描画で共通の言語。localStorage はここでは読まない
 * （Web で読むとサーバー en とクライアント ja が食い違い React #418 → Rork の Error message: {}）。
 * 保存済み言語は ChessProvider の useEffect で適用する。
 */
export function getInitialAppLanguage(): Language {
  return 'en';
}
