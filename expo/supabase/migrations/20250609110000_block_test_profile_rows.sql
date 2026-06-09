-- テスト用プロフィールの新規作成・更新を DB で拒否（再発防止）
CREATE OR REPLACE FUNCTION public.block_test_profile_rows()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF lower(coalesce(NEW.email, '')) = 'chessenger.co.ltd@gmail.com' THEN
    RETURN NEW;
  END IF;

  IF lower(coalesce(NEW.email, '')) = 't@t.com'
     OR NEW.email ~* '^test-[0-9]+@example\.com$'
     OR NEW.email ~* '@example\.com$'
     OR NEW.email ~* '@test\.com$'
     OR lower(coalesce(NEW.email, '')) LIKE 'test@%'
     OR lower(trim(coalesce(NEW.name, ''))) = 'test'
  THEN
    RAISE EXCEPTION 'test profile not allowed';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS block_test_profile_rows ON public.profiles;
CREATE TRIGGER block_test_profile_rows
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.block_test_profile_rows();
