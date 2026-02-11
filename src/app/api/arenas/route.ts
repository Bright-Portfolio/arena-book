import { NextRequest, NextResponse } from "next/server";
import { getArenas, registerArena } from "@/services/arena.service";
import { CreateArenaInputSchema } from "@/lib/validators/arena.schema";
import { auth } from "@/auth";
import { findCompanyByOwnerId } from "@/lib/repositories/company.repo";

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
    const company = await findCompanyByOwnerId(userId);
    if (!company) {
      return NextResponse.json(
        {
          success: false,
          error: "forbidden",
          message: "You must have a registered company to add an arena",
        },
        { status: 403 },
      );
    }

    const companyId = company.id;
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
          field: result.field,
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const category = searchParams.get("category") ?? undefined;

    const result = await getArenas(page, limit, undefined, category);

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
      {
        success: false,
        error: errorMessage,
      },
      {
        status: 500,
      },
    );
  }
}
