# Supabase マイグレーション

**正本は `expo/supabase/migrations/` です。** 本番・開発ともにそちらを `supabase db push` の対象にしてください。

ルートの `supabase/migrations/` は使わないでください（旧・競合ファイルを避けるため）。

手順の例:

```bash
cd expo
supabase link --project-ref <your-project-ref>
supabase db push
```

必須（マッチ統計）:

- `20250412000000_get_profile_match_stats_batch.sql`
- `20250413000000_match_stats_include_accepted.sql`
- `20250414000000_profiles_view_security_invoker_linter.sql`
