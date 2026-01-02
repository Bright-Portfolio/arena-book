import { NextResponse } from "next/server";
import { registerUser } from "@/services/auth.service";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password required",
        },
        { status: 400 }
      );
    }

    // Call service
    const user = await registerUser({ email, password, name });

    return NextResponse.json({ user }, { status: 201 });
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
