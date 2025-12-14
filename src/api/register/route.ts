import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import pool from "@/src/lib/db";

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

    //check existing user
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (rows.length > 0) {
      return NextResponse.json(
        {
          error:
            "This email is already registered. Please log in or use a different email.",
        },
        { status: 400 }
      );
    }

    //Hash password
    const hashedPassword = await hash(password, 10);

    //Create user
    const result = await pool.query(
      "INSERT INTO users (email, password, name, role, auth_provider) VALUES($1, $2, $3, $4, $5) RETURNING id, email, name",
      [email, hashedPassword, name, "user", "credentials"]
    );

    return NextResponse.json({ user: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error("Register failed:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 }
    );
  }
}
