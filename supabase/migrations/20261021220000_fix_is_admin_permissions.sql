-- Allow anonymous storefront queries to evaluate is_admin().
-- This does NOT grant administrator privileges.

BEGIN;

GRANT EXECUTE ON FUNCTION public.is_admin()
TO anon, authenticated;

COMMIT;
