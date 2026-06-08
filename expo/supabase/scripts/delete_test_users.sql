-- デバッグ用テストアカウント削除（Supabase SQL Editor で実行）
-- 対象: test-*@example.com（CI/ローカル検証で作成されたもの）
-- ※ auth.users 削除で profiles 等はトリガー/FK に従って整理されます

DELETE FROM auth.users
WHERE email ~ '^test-[0-9]+@example\.com$';
