import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CLIENT_KEY = "__nlockSupabaseBrowserClient";
const USER_REQUEST_KEY = "__nlockSupabaseVerifiedUserRequest";

export function isSupabaseConfigured() {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      supabaseUrl !== "YOUR_SUPABASE_URL" &&
      supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY",
  );
}

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase env vars are missing for the web app.");
  }

  if (!globalThis[CLIENT_KEY]) {
    globalThis[CLIENT_KEY] = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return globalThis[CLIENT_KEY];
}

export function getVerifiedSupabaseUser() {
  if (!globalThis[USER_REQUEST_KEY]) {
    globalThis[USER_REQUEST_KEY] = getSupabaseBrowserClient().auth.getUser().finally(() => {
      globalThis[USER_REQUEST_KEY] = null;
    });
  }
  return globalThis[USER_REQUEST_KEY];
}
