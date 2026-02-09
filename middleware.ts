export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/api/companies", "/api/companies/:path*", "/api/arenas", "/api/arenas/:path*"],
};
