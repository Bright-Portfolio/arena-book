import pool from "@/lib/db";
import { upsertCompany } from "@/lib/repositories/company.repo";
import { findUserById, updateUserRole } from "@/lib/repositories/user.repo";
import type {
  CreateCompanyInput,
  CreateCompanyOutput,
} from "@/lib/validators/company.schema";

export async function registerOrUpdateCompany({
  userId,
  data,
}: {
  userId: number;
  data: CreateCompanyInput;
}): Promise<CreateCompanyOutput> {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const company = await upsertCompany(userId, data, client);
    // Update user role id not owner
    if (user.role !== "owner") {
      await updateUserRole(userId, "owner", client);
    }

    await client.query("COMMIT");

    return company;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
