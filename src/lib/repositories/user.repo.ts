import pool from "@/src/lib/db";

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
  authProvider: AuthProviderType;
}): Promise<UserRow> {
  const result = await pool.query(
    `INSERT INTO users (emai, password, name, role, auth_provider)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [data.email, data.password, data.name, "user", data.authProvider]
  );

  return result.rows[0];
}
