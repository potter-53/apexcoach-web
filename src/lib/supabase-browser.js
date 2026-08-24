import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const CLIENT_KEY = "__nlockSupabaseBrowserClient";
const USER_REQUEST_KEY = "__nlockSupabaseVerifiedUserRequest";
const authLockQueue = new Map();

async function nlockBrowserLock(name, _acquireTimeout, operation) {
  const previous = authLockQueue.get(name) || Promise.resolve();
  let release;
  const current = new Promise((resolve) => { release = resolve; });
  const queued = previous.catch(() => {}).then(() => current);
  authLockQueue.set(name, queued);

  await previous.catch(() => {});
  try {
    return await operation();
  } finally {
    release();
    if (authLockQueue.get(name) === queued) authLockQueue.delete(name);
  }
}

export function isSupabaseConfigured() {
  return Boolean(
    supabaseUrl &&
      supabaseAnonKey &&
      supabaseUrl !== "YOUR_SUPABASE_URL" &&
      supabaseAnonKey !== "YOUR_SUPABASE_ANON_KEY",
  );
}

export function clearStoredSupabaseSession() {
  if (typeof window === "undefined" || !supabaseUrl) return;
  try {
    const projectRef = new URL(supabaseUrl).hostname.split(".")[0];
    window.localStorage.removeItem(`sb-${projectRef}-auth-token`);
  } catch {
    // A página de login continua funcional mesmo sem storage disponível.
  }
  globalThis[USER_REQUEST_KEY] = null;
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
        lock: nlockBrowserLock,
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
