import { access } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

async function resolveBundledApk(request) {
  const bundledApkPath = path.join(process.cwd(), "public", "downloads", "apex-coach-latest.apk");
  try {
    await access(bundledApkPath);
    return new URL("/downloads/apex-coach-latest.apk", request.url).toString();
  } catch {
    return null;
  }
}

function resolveConfiguredUrl(request) {
  const configuredUrl =
    process.env.APK_DIRECT_URL ||
    process.env.NEXT_PUBLIC_APK_DIRECT_URL ||
    "/signup";
  return new URL(configuredUrl, request.url).toString();
}

async function resolveLatestFromStorage(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const bucket = process.env.APK_STORAGE_BUCKET;
  if (!supabaseUrl || !anonKey || !bucket) return null;

  const prefix = (process.env.APK_STORAGE_PREFIX ?? "").replace(/^\/+|\/+$/g, "");
  const listUrl = `${supabaseUrl}/storage/v1/object/list/${bucket}`;
  const response = await fetch(listUrl, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prefix,
      limit: 200,
      offset: 0,
      sortBy: { column: "updated_at", order: "desc" },
    }),
    cache: "no-store",
  });
  if (!response.ok) return null;
  const items = await response.json();
  if (!Array.isArray(items) || !items.length) return null;

  const apks = items.filter((item) => String(item?.name ?? "").toLowerCase().endsWith(".apk"));
  if (!apks.length) return null;
  apks.sort((a, b) => {
    const aTs = new Date(a?.updated_at ?? a?.created_at ?? 0).getTime();
    const bTs = new Date(b?.updated_at ?? b?.created_at ?? 0).getTime();
    return bTs - aTs;
  });
  const latestName = String(apks[0]?.name ?? "").trim();
  if (!latestName) return null;

  const objectPath = [prefix, latestName].filter(Boolean).join("/");
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${encodeURI(objectPath)}`;
  return new URL(publicUrl, request.url).toString();
}

export async function GET(request) {
  const bundledApkUrl = await resolveBundledApk(request);
  if (bundledApkUrl) {
    return NextResponse.redirect(bundledApkUrl, 302);
  }

  const explicitDirect =
    process.env.APK_DIRECT_URL?.trim() ||
    process.env.NEXT_PUBLIC_APK_DIRECT_URL?.trim() ||
    "";
  if (explicitDirect) {
    const directUrl = new URL(explicitDirect, request.url).toString();
    return NextResponse.redirect(directUrl, 302);
  }

  const latestFromStorage = await resolveLatestFromStorage(request).catch(() => null);
  const targetUrl = latestFromStorage ?? resolveConfiguredUrl(request);
  return NextResponse.redirect(targetUrl, 302);
}
