-- デバッグ用・テスト用アカウント削除（Supabase SQL Editor で実行）
-- auth.users 削除で profiles 等はトリガー/FK に従って整理されます

DELETE FROM auth.users
WHERE email ~ '^test-[0-9]+@example\.com$'
   OR lower(email) = 't@t.com'
   OR email ~ '@example\.com$'
   OR email ~ '@test\.com$'
   OR lower(email) LIKE 'test@%';

-- 名前が Test のみ（審査用デモ chessenger.co.ltd@gmail.com は残す）
DELETE FROM auth.users u
USING public.profiles p
WHERE p.id = u.id
  AND lower(trim(p.name)) = 'test'
  AND lower(coalesce(u.email, '')) <> 'chessenger.co.ltd@gmail.com';
