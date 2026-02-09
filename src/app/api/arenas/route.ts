import { NextResponse } from "next/server";
import { registerArena } from "@/services/arena.service";
import { CreateArenaInputSchema } from "@/lib/validators/arena.schema";
import { auth } from "@/auth";
import { findUserById } from "@/lib/repositories/user.repo";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: "unauthorized",
          message: "You must be logged in to perform this action",
        },
        { status: 401 },
      );
    }

    const userId = Number(session.user.id);
    const user = await findUserById(userId);
    if (!user?.company_id) {
      return NextResponse.json(
        {
          success: false,
          error: "forbidden",
          message: "You must have a registered company to add an arena",
        },
        { status: 403 },
      );
    }

    const companyId = user.company_id;
    const body = await request.json();

    const validatedInput = CreateArenaInputSchema.safeParse({
      ...body,
      companyId,
    });
    if (!validatedInput.success) {
      return NextResponse.json(
        {
          success: false,
          error: "validation_failed",
          message: "Invalid input data",
        },
        { status: 400 },
      );
    }

    const result = await registerArena(companyId, validatedInput.data);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "register_failed",
          message: result.error || "Failed to register arena",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to register arena:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        data: null,
      },
      { status: 500 },
    );
  }
}
