-- 20251107_auth_triggers.sql
-- Triggers to automatically create a public.profiles entry when a new user signs up

BEGIN;

-- 1. Function to create a profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$;

-- 2. Trigger to call the function on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

COMMIT;

