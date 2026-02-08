import pool from "@/lib/db";
import {
  CreateArenaOutput,
  CreateArenaOutputSchema,
  type CreateArenaInput,
} from "../validators/arena.schema";

/**
 * Upsert arena info
 *
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
        image_url,
        latitude,
        longitude,
        country_code,
        phone_no,
        capacity,
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13
      )
        WHERE company_id = $14
      RETURNING *, 
    `,
    [
      data.name,
      data.description,
      data.price,
      data.openTime,
      data.closeTime,
      data.category,
      data.address,
      data.imageUrl,
      data.latitude,
      data.longitude,
      data.phoneCountryISO2,
      data.phoneNo,
      data.capacity,
      companyId,
    ],
  );

  const firstRow = result.rows[0];
  const parsed = CreateArenaOutputSchema.parse(firstRow);
  return parsed;
}
