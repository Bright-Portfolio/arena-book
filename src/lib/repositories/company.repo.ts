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
    WITH upsert_company AS (
    INSERT INTO companies (owner_id, name, phone_country_code, phone_no, address)
      SELECT $1, $2, $3, $4, $5
      WHERE EXISTS (SELECT 1 FROM users WHERE id = $1)
      ON CONFLICT (owner_id)
      DO UPDATE SET
        name = EXCLUDED.name,
        phone_country_code = EXCLUDED.phone_country_code,
        phone_no = EXCLUDED.phone_no,
        address = EXCLUDED.address
      RETURNING id, owner_id as "ownerId", name, phone_country_code as "phoneCountryISO2", phone_no as "phoneNo", address
    ),  
    update_user AS (
      UPDATE users SET role = 'owner'
      WHERE id = $1
    )
    SELECT * FROM upsert_company
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

export async function findCompanyByOwnerId(userId: number) {
  const result = await pool.query(
    `
      SELECT id, owner_id AS "ownerId", name, phone_country_code AS "phoneCountryISO2", phone_no AS "phoneNo", address
      FROM companies
      WHERE owner_id = $1
    `,
    [userId],
  );

  return result.rows[0] || null;
}

export async function findCompanyById(companyId: number) {
  const result = await pool.query(
    `
      SELECT * FROM companies WHERE id = $1
    `,
    [companyId],
  );

  return result.rows[0];
}
