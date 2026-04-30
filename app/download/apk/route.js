import { NextResponse } from "next/server";

export function GET(request) {
  const configuredUrl =
    process.env.APK_DIRECT_URL ||
    process.env.NEXT_PUBLIC_APK_DIRECT_URL ||
    "/downloads/apex-coach-latest.apk";

  const targetUrl = new URL(configuredUrl, request.url);
  return NextResponse.redirect(targetUrl, 302);
}

