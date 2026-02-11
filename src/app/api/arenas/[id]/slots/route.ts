import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlots } from "@/services/booking.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const dateStr = request.nextUrl.searchParams.get("date");

    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return NextResponse.json(
        {
          success: false,
          error: "validation_failed",
          message: "date query parameter is required in YYYY-MM-DD format",
        },
        { status: 400 },
      );
    }

    const result = await getAvailableSlots(Number(id), dateStr);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "not_found", message: result.error },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
