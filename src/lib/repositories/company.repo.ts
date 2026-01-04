import pool from "@/lib/db";
import { CreateCompanyInput, CreateCompanyOutput } from "../validators/company.schema";

/**
 * Insert company info if not exist
 *
 * @param userId
 */
export async function upsertCompany(
  userId: number,
  data: CreateCompanyInput
): Promise<CreateCompanyOutput> {
    await pool.query(`
        INSERT `)
}
