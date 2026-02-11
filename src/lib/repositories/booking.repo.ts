import pool from "@/lib/db";
import type {
  BookingOutput,
  BookingWithArena,
} from "../validators/booking.schema";

export async function findConflictingBooking(
  arenaId: number,
  startAt: Date,
  endAt: Date,
): Promise<boolean> {
  const result = await pool.query(
    `
        SELECT id FROM bookings
            WHERE arena_id = $1
            AND start_at < $3
            AND end_at > $2
            AND status != 'cancelled'
        LIMIT 1
        `,
    [arenaId, startAt, endAt],
  );

  return result.rows.length > 0;
}

export async function findBookingByArenaAndDate(
  arenaId: number,
  dateStr: string,
): Promise<{ startAt: Date; endAt: Date }[]> {
  const result = await pool.query<{ startAt: Date; endAt: Date }>(
    `
            SELECT start_at AS "startAt",
                end_at AS "endAt"
            FROM bookings
            WHERE arena_id = $1
            AND start_at::date = $2::date
            AND status != 'cancelled'
        `,
    [arenaId, dateStr],
  );

  return result.rows;
}

/**
 * Insert booking data to database
 */
export async function insertBooking(
  userId: number,
  arenaId: number,
  startAt: Date,
  endAt: Date,
  totalPrice: number,
): Promise<BookingOutput> {
  const result = await pool.query<BookingOutput>(
    `
            INSERT INTO bookings (
                status, start_at, end_at, total_price, user_id, arena_id
            ) VALUES (
                'confirmed', $1, $2, $3, $4, $5
            )
            RETURNING
                id,
                status,
                start_at AS "startAt",
                end_at AS "endAt",
                total_price AS "totalPrice",
                user_id AS "userId",
                arena_id AS "arenaId",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
        `,
    [startAt, endAt, totalPrice, userId, arenaId],
  );

  return result.rows[0];
}

/**
 * Find booking by bookingId
 */
export async function findBookingById(id: number): Promise<BookingOutput | null> {
  const result = await pool.query<BookingOutput>(
    `
            SELECT
                id, status,
                start_at AS "startAt",
                end_at AS "endAt",
                total_price AS "totalPrice",
                user_id AS "userId",
                arena_id AS "arenaId",
                created_at AS "createdAt",
                updated_at AS "updatedAt"
            FROM bookings
            WHERE id = $1
        `,
    [id],
  );

  return result.rows[0] || null;
}

/**
 * Find bookings by userId
 */
export async function findBookingsByUserId(
  userId: number,
  page: number,
  limit: number,
): Promise<{ data: BookingWithArena[]; totalCount: number }> {
  const offset = (page - 1) * limit;

  const result = await pool.query<BookingWithArena>(
    `
        SELECT
            b.id, b.status,
            b.start_at AS "startAt",
            b.end_at AS "endAt",
            b.total_price AS "totalPrice",
            b.user_id AS "userId",
            b.arena_id AS "arenaId",
            b.created_at AS "createdAt",
            b.updated_at AS "updatedAt",
            a.name AS "arenaName",
            a.category AS "arenaCategory",
            a.address AS "arenaAddress",
            a.price AS "arenaPrice"
        FROM bookings b
        JOIN arenas a ON a.id = b.arena_id
        WHERE b.user_id = $1
        ORDER BY b.start_at DESC
        LIMIT $2 OFFSET $3
    `,
    [userId, limit, offset],
  );

  const countResult = await pool.query(
    `
        SELECT COUNT(*) FROM bookings WHERE user_id = $1
    `,
    [userId],
  );
  const totalCount = Number(countResult.rows[0].count);
  return {
    data: result.rows,
    totalCount: totalCount,
  };
}

/**
 * Find company by companyId
 */
export async function findBookingsByCompanyId(
  companyId: number,
  page: number,
  limit: number,
): Promise<{
  data: (BookingWithArena & { userName: string })[];
  totalCount: number;
}> {
  const offset = (page - 1) * limit;

  const result = await pool.query<BookingWithArena & { userName: string }>(
    `
        SELECT
            b.id, b.status,
            b.start_at AS "startAt",
            b.end_at AS "endAt",
            b.total_price AS "totalPrice",
            b.user_id AS "userId",
            b.arena_id AS "arenaId",
            b.created_at AS "createdAt",
            b.updated_at AS "updatedAt",
            a.name AS "arenaName",
            a.category AS "arenaCategory",
            a.address AS "arenaAddress",
            a.price AS "arenaPrice",
            u.name AS "userName"
        FROM bookings b
        JOIN arenas a ON a.id = b.arena_id
        JOIN users u ON u.id = b.user_id
        WHERE a.company_id = $1
        ORDER BY b.start_at DESC
        LIMIT $2 OFFSET $3
    `,
    [companyId, limit, offset],
  );

  const countResult = await pool.query(
    `
        SELECT COUNT(*)
        FROM bookings b
        JOIN arenas a ON a.id = b.arena_id
        WHERE a.company_id = $1
    `,
    [companyId],
  );

  const totalCount = Number(countResult.rows[0].count);
  return {
    data: result.rows,
    totalCount: totalCount,
  };
}

/**
 * Update booking status to cancelled for cancel booking case
 */
export async function updateBookingStatus(
  id: number,
  status: string,
): Promise<BookingOutput> {
  const result = await pool.query<BookingOutput>(
    `
        UPDATE bookings 
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING
            id, 
            status,
            start_at AS "startAt",
            end_at AS "endAt",
            total_price AS "totalPrice",
            user_id AS "userId",
            arena_id AS "arenaId",
            created_at AS "createdAt",
            updated_at AS "updatedAt"
            `,
    [status, id],
  );

  return result.rows[0];
}
