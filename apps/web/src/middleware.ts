import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // Rotas públicas que não exigem autenticação
  const isPublicRoute =
    nextUrl.pathname === "/" ||
    nextUrl.pathname.startsWith("/api/auth") ||
    nextUrl.pathname === "/login" ||
    nextUrl.pathname.startsWith("/_next") ||
    nextUrl.pathname === "/favicon.ico" ||
    nextUrl.pathname === "/manifest.webmanifest" ||
    nextUrl.pathname === "/manifest.json" ||
    nextUrl.pathname.endsWith(".webmanifest") ||
    nextUrl.pathname.endsWith(".png") ||
    nextUrl.pathname.endsWith(".svg") ||
    nextUrl.pathname.endsWith(".ico") ||
    nextUrl.pathname.endsWith(".jpg") ||
    nextUrl.pathname.endsWith(".webp");

  if (!isLoggedIn && !isPublicRoute) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return Response.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl),
    );
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest|mp3)$).*)",
  ],
  runtime: "nodejs",
};
