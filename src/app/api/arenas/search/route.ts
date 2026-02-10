import { NextResponse } from "next/server";
import { searchArenasWithCategory } from "@/services/arena.service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q");
    const category = searchParams.get("category") ?? undefined;

    if (!q) {
      return NextResponse.json({
        
      })
    }
  } catch (error) {}
}
