import { NextResponse } from "next/server";
import { registerOrUpdateCompany } from "@/services/company.service";
import {
  CreateCompanyInputSchema,
  CreateCompanyOutputSchema,
} from "@/lib/validators/company.schema";
import { auth } from "@/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  try {
    const body = await request.json();
    const { userId: userIdString } = await params;
    const userId = parseInt(userIdString, 10);
    const session = await auth();
    if (Number(session?.user.id) !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const validatedInput = CreateCompanyInputSchema.safeParse({
      ...body,
      ownerId: userId,
    });
    if (!validatedInput.success) {
      return NextResponse.json(
        {
          error: validatedInput.error.issues,
        },
        { status: 400 },
      );
    }

    const result = await registerOrUpdateCompany(userId, validatedInput.data);
    const validatedOutput = CreateCompanyOutputSchema.parse(result);

    return NextResponse.json({ company: validatedOutput }, { status: 200 });
  } catch (error) {
    console.error("Failed to register or update company:", error);

    if (error instanceof Error && error.message === "User not found") {
      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 404 },
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
