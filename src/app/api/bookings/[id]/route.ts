import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { cancelBooking } from "@/services/booking.service";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "unauthorized",
          message: "You must be logged in to cancel a booking",
        },
        { status: 401 },
      );
    }

    const userId = Number(session.user.id);
    const companyId = session.user.companyId;
    const { id } = await params;
    const body = await request.json();

    if (body.action !== "cancel") {
      return NextResponse.json(
        { success: false, error: "invalid_action", message: "Unknown action" },
        { status: 400 },
      );
    }

    const result = await cancelBooking(userId, Number(id), companyId);

    if (!result.success) {
      const status = result.error === "Booking not found" ? 404 : 400;
      return NextResponse.json(
        { success: false, error: "cancel_failed", message: result.error },
        { status },
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
