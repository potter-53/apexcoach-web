import { NextResponse } from "next/server";

const NLOCK_HOSTS = new Set(["nlock.pt", "www.nlock.pt"]);
const APEX_HOSTS = new Set(["apexcoach.pt", "www.apexcoach.pt"]);

export function proxy(request) {
  const host = (request.headers.get("host") || "").split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;

  if (NLOCK_HOSTS.has(host)) {
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/nlock", request.url));
    }
    if (pathname === "/test" || pathname === "/nlock") {
      return NextResponse.redirect(new URL("/", request.url), 308);
    }
  }

  if (APEX_HOSTS.has(host) && pathname === "/test") {
    return NextResponse.redirect("https://nlock.pt/", 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/test", "/nlock"],
};
