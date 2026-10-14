import { NextRequest, NextResponse } from "next/server";

/** WordPress is mounted at the SAME /landing path on its independent origin. */
export function middleware(request: NextRequest) {
  const configured = process.env.FG_WORDPRESS_ORIGIN;
  if (!configured) return NextResponse.next();
  const secret = process.env.FG_PROXY_SECRET;
  let origin: URL;
  try {
    origin = new URL(configured);
    if (origin.protocol !== "https:" || origin.pathname !== "/" || origin.search ||
        origin.hash || origin.username || origin.password ||
        origin.host === request.nextUrl.host || !secret || secret.length < 32) throw new Error();
  } catch {
    return new NextResponse("Landing service configuration unavailable.", { status: 503 });
  }
  // Next strips trailing slashes. Resolve the admin directory to its entry file
  // so the origin does not redirect back to /wp-admin/ indefinitely.
  const pathname = request.nextUrl.pathname === "/landing/wp-admin"
    ? "/landing/wp-admin/index.php" : request.nextUrl.pathname;
  const destination = new URL(pathname + request.nextUrl.search, origin);
  const headers = new Headers(request.headers);
  // Overwrite visitor-supplied values. Never send the credential as a response header.
  headers.set("x-fg-proxy-token", secret!);
  headers.set("x-fg-client-ip", process.env.VERCEL === "1"
    ? (request.headers.get("x-vercel-forwarded-for") || "").split(",")[0].trim()
    : "");
  headers.set("x-forwarded-proto", "https");
  const response = NextResponse.rewrite(destination, { request: { headers } });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  return response;
}

export const config = { matcher: ["/landing", "/landing/:path*"] };
