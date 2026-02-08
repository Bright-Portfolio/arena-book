import pool from "@/lib/db";
import {
  CreateCompanyInput,
  CreateCompanyOutput,
} from "../validators/company.schema";

/**
 * Upsert company info if not exist
 *
 * @param userId
 */
export async function upsertCompany(
  userId: number,
  data: CreateCompanyInput,
): Promise<CreateCompanyOutput> {
  const result = await pool.query(
    `
    WITH update_role AS (
      UPDATE users 
      SET role = 'owner' 
      WHERE id = $1
      RETURNING id
    )
    INSERT INTO companies (
        owner_id,
        name,
        country_code,
        phone_no,
        address
      ) SELECT $1, $2, $3, $4, $5
      FROM update_role 
      ON CONFLICT (owner_id)
      DO UPDATE SET
      name = EXCLUDED.name,
      country_code = EXCLUDED.country_code,
      phone_no = EXCLUDED.phone_no,
      address = EXCLUDED.address
      RETURNING id, owner_id as "ownerId", name, country_code as "phoneCountryISO2", phone_no as "phoneNo", address
      `,
    [userId, data.name, data.phoneCountryISO2, data.phoneNo, data.address],
  );

  return result.rows[0];
}

export async function findCompanyByName(
  companyName: string,
): Promise<{ name: string } | null> {
  const result = await pool.query<{ name: string }>(
    `
      SELECT name
      FROM companies
      WHERE name = $1
    `,
    [companyName],
  );

  return result.rows[0] || null;
}
