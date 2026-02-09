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
        latitude,
        longitude,
        country_code,
        phone_no,
        capacity,
        company_id
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
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
      data.imageUrls,
      data.latitude,
      data.longitude,
      data.phoneCountryISO2,
      data.phoneNo,
      data.capacity,
      companyId,
    ],
  );

  return result.rows[0];
}

/**
 * Search arena info from database
 */
export async function searchArenas(
  query: string,
  category?: string,
): Promise<CreateArenaOutput[]> {
  const params = [`%${query}%`];
  let sql = `
    SELECT * FROM arenas 
    WHERE (name ILIKE $1 OR address ILIKE $1 OR category ILIKE $1)
  `;

  if (category) {
    params.push(category);
    sql += ` AND category = $${params.length}`;
  }

  const result = await pool.query<CreateArenaOutput>(sql, params);
  return result.rows;
}
