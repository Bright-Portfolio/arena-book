import { NextResponse } from "next/server";
import { registerArena } from "@/services/arena.service";
import { CreateArenaInputSchema } from "@/lib/validators/arena.schema";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ companyId: string }> },
) {
  try {
    const body = await request.json();
    const { companyId: companyIdStr } = await params;
    const comapnyId = parseInt(companyIdStr, 10);

    const validatedInput = CreateArenaInputSchema.safeParse(body);
    if (!validatedInput.success) {
      return NextResponse.json(
        {
          success: false,
          error: validatedInput.error.issues,
          data: null,
        },
        { status: 400 },
      );
    }

    const result = await registerArena(comapnyId, validatedInput.data);
    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
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
