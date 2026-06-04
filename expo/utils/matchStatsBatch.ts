import type { SupabaseClient } from '@supabase/supabase-js';

export interface MatchStats {
  games_played: number;
  wins: number;
  losses: number;
  draws: number;
}

function statsFromRow(p: Record<string, unknown>): MatchStats {
  return {
    games_played: Number(p.games_played ?? 0),
    wins: Number(p.wins ?? 0),
    losses: Number(p.losses ?? 0),
    draws: Number(p.draws ?? 0),
  };
}

async function fetchStatsFromView(
  client: SupabaseClient,
  ids: string[],
): Promise<Map<string, MatchStats>> {
  const map = new Map<string, MatchStats>();
  if (ids.length === 0) return map;

  const { data, error } = await client
    .from('profiles_with_match_stats')
    .select('id, games_played, wins, losses, draws')
    .in('id', ids);

  if (error || !data?.length) return map;

  for (const row of data as Record<string, unknown>[]) {
    const id = row.id as string;
    if (id) map.set(id, statsFromRow(row));
  }
  return map;
}

/**
 * マッチ統計を RPC で一括取得。
 * 未デプロイ時は profiles_with_match_stats ビュー → 最後に profiles 列。
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
    for (const id of ids) {
      if (!map.has(id)) {
        const row = profileRows.find((p) => p.id === id);
        if (row) map.set(id, statsFromRow(row));
      }
    }
    return map;
  }

  if (error && typeof __DEV__ !== 'undefined' && __DEV__) {
    const code = error.code ?? '';
    const msg = error.message ?? '';
    // 404 は未デプロイ時の想定内 — console.error にすると Rork が Error message: {} を出す
    if (code !== 'PGRST202' && !String(msg).includes('404')) {
      console.warn('fetchProfileMatchStatsBatch: RPC unavailable, trying view fallback', code, msg);
    }
  }

  const viewMap = await fetchStatsFromView(client, ids);
  if (viewMap.size > 0) {
    for (const id of ids) {
      map.set(id, viewMap.get(id) ?? statsFromRow(profileRows.find((p) => p.id === id) ?? { id }));
    }
    return map;
  }

  for (const p of profileRows) {
    map.set(p.id, statsFromRow(p));
  }
  return map;
}
