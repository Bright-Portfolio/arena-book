import pool from "@/lib/db";
import {
  type CreateArenaOutput,
  type CreateArenaInput,
} from "../validators/arena.schema";

/**
 * Insert arena info to database
 */

export async function insertArena(
  companyId: number,
  data: CreateArenaInput,
): Promise<CreateArenaOutput> {
  const result = await pool.query<CreateArenaOutput>(
    `
      INSERT INTO arenas(
        name,
        description,
        price,
        open_time,
        close_time,
        category,
        address,
        image_urls,
        phone_country_code,
        phone_no,
        capacity,
        company_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
      )
      RETURNING *
    `,
    [
      data.name,
      data.description,
      data.price,
      data.openTime,
      data.closeTime,
      data.category,
      data.address,
      JSON.stringify(data.imageUrls ?? []),
      data.phoneCountryISO2,
      data.phoneNo,
      data.capacity,
      companyId,
    ],
  );

  return result.rows[0];
}

export async function findArenaByName(
  name: string,
): Promise<{ name: string } | null> {
  const result = await pool.query<{ name: string }>(
    `SELECT name FROM arenas WHERE name ILIKE $1`,
    [name],
  );
  return result.rows[0] || null;
}

/**
 * Find arenas by category
 */
export async function findArenas(
  page: number,
  limit: number,
  companyId?: number,
  category?: string,
) {
  const offset = (page - 1) * limit;

  const params: (string | number)[] = [];
  const conditions: string[] = [];

  if (category) {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }

  if (companyId) {
    params.push(companyId);
    conditions.push(`company_id = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  params.push(limit, offset);
  const sql = `
    SELECT
      id,
      name,
      description,
      price,
      capacity,
      open_time AS "openTime",
      close_time AS "closeTime",
      category,
      address,
      image_urls AS "imageUrls",
      phone_country_code AS "phoneCountryISO2",
      phone_no AS "phoneNo",
      company_id AS "companyId",
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      deleted_at AS "deletedAt"
    FROM arenas
    ${where}
    ORDER BY created_at DESC
    LIMIT $${params.length - 1} OFFSET $${params.length}
  `;

  const result = await pool.query(sql, params);

  // Count query reuses the same conditions
  const countParams: (string | number)[] = [];
  const countConditions: string[] = [];

  if (category) {
    countParams.push(category);
    countConditions.push(`category = $${countParams.length}`);
  }

  if (companyId) {
    countParams.push(companyId);
    countConditions.push(`company_id = $${countParams.length}`);
  }

  const countWhere = countConditions.length
    ? `WHERE ${countConditions.join(" AND ")}`
    : "";

  const countResult = await pool.query(
    `
     SELECT COUNT(*) FROM arenas ${countWhere}
     `,
    countParams,
  );
  const totalCount = Number(countResult.rows[0].count);

  return {
    data: result.rows,
    totalCount,
  };
}

/**
 * Update arena info
 */
// export async function updateArena(arenaId: number) {
//   const result = await pool.query(`

//     `)
// }
