import { NextRequest, NextResponse } from "next/server";
import { getArenas } from "@/services/arena.service";
import { auth } from "@/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  const companyId = session?.user?.companyId;

  if (!companyId) {
    return NextResponse.json(
      {
        success: false,
        error: "forbidden",
        message: "No company found",
      },
      { status: 403 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 10);
  const category = searchParams.get("category") ?? undefined;

  const result = await getArenas(page, limit, companyId, category);

  return NextResponse.json({
    success: true,
    data: result.data,
    totalCount: result.totalCount,
    hasMore: result.hasMore,
  });
}
