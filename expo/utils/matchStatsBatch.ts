import type { SupabaseClient } from '@supabase/supabase-js';

export interface MatchStats {
  games_played: number;
  wins: number;
  losses: number;
  draws: number;
}

function statsFromProfileRow(p: Record<string, unknown>): MatchStats {
  return {
    games_played: Number(p.games_played ?? 0),
    wins: Number(p.wins ?? 0),
    losses: Number(p.losses ?? 0),
    draws: Number(p.draws ?? 0),
  };
}

/**
 * マッチ統計を RPC で一括取得。未デプロイ時 (404) は profiles 列にフォールバック。
 */
export async function fetchProfileMatchStatsBatch(
  client: SupabaseClient,
  profileRows: Array<{ id: string } & Record<string, unknown>>,
): Promise<Map<string, MatchStats>> {
  const map = new Map<string, MatchStats>();
  if (profileRows.length === 0) return map;

  const ids = profileRows.map((p) => p.id);
  const { data, error } = await client.rpc('get_profile_match_stats_batch', {
    p_profile_ids: ids,
  });

  if (!error && data?.length) {
    for (const r of data as Array<{
      profile_id: string;
      games_played: number;
      wins: number;
      losses: number;
      draws: number;
    }>) {
      map.set(r.profile_id, {
        games_played: r.games_played ?? 0,
        wins: r.wins ?? 0,
        losses: r.losses ?? 0,
        draws: r.draws ?? 0,
      });
    }
    return map;
  }

  if (error && typeof __DEV__ !== 'undefined' && __DEV__) {
    console.warn(
      'fetchProfileMatchStatsBatch: RPC unavailable, using profile columns',
      error.code ?? '',
      error.message ?? ''
    );
  }

  for (const p of profileRows) {
    map.set(p.id, statsFromProfileRow(p));
  }
  return map;
}
