import pool from "@/lib/db";
import { CreateCompanyInput } from "../validators/company.schema";

/**
 * Insert company info if not exist
 *
 * @param userId
 */
export async function createCompany(
  userId: number,
  data: CreateCompanyInput
): Promise<> {
    await pool.query(`
        INSERT r`)
}
