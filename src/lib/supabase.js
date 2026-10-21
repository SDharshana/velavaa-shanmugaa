import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (
  import.meta.env.VITE_SUPABASE_URL || ""
).trim();

const supabaseKey = (
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  ""
).trim();

export const supabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl.startsWith("https://")
);

export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

if (!supabaseConfigured) {
  console.error(
    "Supabase configuration missing. " +
    "Check VITE_SUPABASE_URL and " +
    "VITE_SUPABASE_PUBLISHABLE_KEY or " +
    "VITE_SUPABASE_ANON_KEY. " +
    "Restart the Vite development server."
  );
}
