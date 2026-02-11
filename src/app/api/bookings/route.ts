import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { CreateBookingInputSchema } from "@/lib/validators/booking.schema";
import { createBooking, getUserBookings } from "@/services/booking.service";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "unauthorized",
          message: "You must be logged in to book an arena",
        },
        { status: 401 },
      );
    }

    const userId = Number(session.user.id);
    const body = await request.json();

    const validated = CreateBookingInputSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: "validation_failed",
          message: "Invalid booking data",
        },
        { status: 400 },
      );
    }

    const { arenaId, date, startHour, hours } = validated.data;
    const result = await createBooking(userId, arenaId, date, startHour, hours);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "booking_failed",
          message: result.error,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to create booking:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage, data: null },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "unauthorized",
          message: "You must be logged in to view your bookings",
        },
        { status: 401 },
      );
    }

    const userId = Number(session.user.id);
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);

    const result = await getUserBookings(userId, page, limit);

    return NextResponse.json({
      success: true,
      data: result.data,
      totalCount: result.totalCount,
      hasMore: result.hasMore,
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
