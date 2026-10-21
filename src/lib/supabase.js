import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

const configured = Boolean(supabaseUrl && supabaseKey);

export const supabase = configured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

if (!configured) {
  console.warn(
    "Supabase is not configured. Check your .env file."
  );
}
