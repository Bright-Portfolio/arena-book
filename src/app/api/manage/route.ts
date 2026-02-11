import { NextResponse } from "next/server";
import { getArenasByCompanyId } from "@/services/arena.service";
import { auth } from "@/auth";

export async function GET() {
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
  const result = await getArenasByCompanyId(companyId);

  return NextResponse.json({ success: true, data: result });
}
