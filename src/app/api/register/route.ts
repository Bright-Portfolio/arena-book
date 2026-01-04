import { NextResponse } from "next/server";
import { registerUser } from "@/services/auth.service";
import {
  RegisterInputSchema,
  RegisterOutputSchema,
} from "@/lib/validators/auth.schema";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = RegisterInputSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error.issues,
        },
        { status: 400 }
      );
    }
    const validatedInput = result.data;

    const user = await registerUser(validatedInput);

    const validatedUser = RegisterOutputSchema.parse(user);

    return NextResponse.json({ user: validatedUser }, { status: 201 });
  } catch (error) {
    // Handle known errors
    if (error instanceof Error) {
      if (error.message === "Email already registered") {
        return NextResponse.json(
          {
            error: error.message,
          },
          { status: 400 }
        );
      }
    }

    console.error("Register failed:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
