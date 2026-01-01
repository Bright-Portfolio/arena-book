import pool from "@/lib/db";

type UserRole = "user" | "owner";
type AuthProviderType = "credentials" | "google";

export interface UserRow {
  id: number;
  email: string;
  password: string | null;
  name: string;
  role: UserRole;
  auth_provider: AuthProviderType;
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  // Find existing user
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (!result) return null;

  return result.rows[0];
}

export async function createUser(data: {
  email: string;
  password?: string;
  name?: string;
  image_url?: string;
  authProvider: AuthProviderType;
}): Promise<UserRow> {
  const result = await pool.query(
    `INSERT INTO users (email, password, name, image_url, role, auth_provider)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *`,
    [
      data.email,
      data.password,
      data.name,
      data.image_url,
      "user",
      data.authProvider,
    ]
  );

  return result.rows[0];
}
