import { NextRequest, NextResponse } from "next/server";
import { deleteArena, getArenaById, updateArena } from "@/services/arena.service";
import { CreateArenaInputSchema } from "@/lib/validators/arena.schema";
import { auth } from "@/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const arena = await getArenaById(Number(id));

    if (!arena) {
      return NextResponse.json(
        { success: false, error: "not_found", message: "Arena not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: arena });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const companyId = session?.user?.companyId;

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "forbidden", message: "No company found" },
        { status: 403 },
      );
    }

    const { id } = await params;
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

    const result = await updateArena(companyId, Number(id), validatedInput.data);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "update_failed",
          message: result.error,
          field: result.field,
        },
        { status: 400 },
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const companyId = session?.user?.companyId;

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: "forbidden", message: "No company found" },
        { status: 403 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    if (body.action !== "soft-delete") {
      return NextResponse.json(
        { success: false, error: "invalid_action", message: "Unknown action" },
        { status: 400 },
      );
    }

    const result = await deleteArena(companyId, Number(id));

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "not_found", message: result.error },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
