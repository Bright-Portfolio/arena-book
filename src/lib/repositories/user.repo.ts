import pool from "@/lib/db";
import type {
  CreateUserInput,
  CreateUserOutput,
  UserWithPassword,
} from "../validators/user.schema";

// For authentication  - includes password
export async function findUserByEmail(
  email: string
): Promise<CreateUserOutput | null> {
  // Find existing user
  const result = await pool.query(
    `SELECT  id, email, password, name, image_url, role, auth_provider 
    FROM users 
    WHERE email = $1`,
    [email]
  );

  if (result.rows.length === 0) return null;

  return result.rows[0];
}

// For public use - excludes password
export async function getUserByEmail(
  email: string
): Promise<UserWithPassword | null> {
  const result = await pool.query(
    `
    SELECT id, email, name, image_url, role, auth_provider
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  if (result.rows.length === 0) return null;

  return result.rows[0];
}

export async function createUser(
  data: CreateUserInput
): Promise<CreateUserOutput> {
  const result = await pool.query(
    `INSERT INTO users (email, password, name, image_url, role, auth_provider)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, email, name, image_url, role, auth_provider`,
    [
      data.email,
      data.password,
      data.name,
      data.imageUrl,
      "user",
      data.authProvider,
    ]
  );

  return result.rows[0];
}
