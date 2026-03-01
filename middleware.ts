import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth?.user?.id) {
    return NextResponse.json(
      { success: false, error: "unauthorized" },
      { status: 401 },
    );
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/api/companies/:path*",
    "/api/bookings/:path*",
    "/api/manage/:path*",
  ],
};
