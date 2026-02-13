import {
  findBookingById,
  findBookingByArenaAndDate,
  findBookingsByCompanyId,
  findBookingsByUserId,
  findConflictingBooking,
  insertBooking,
  updateBookingStatus,
} from "@/lib/repositories/booking.repo";
import { findArenaById } from "@/lib/repositories/arena.repo";
import type {
  BookingOutput,
  BookingWithArena,
  Slot,
} from "@/lib/validators/booking.schema";

export interface BookingResult {
  success: boolean;
  error?: string;
  data: BookingOutput | null;
}

/**
 * Generate hourly time slots for an arena on a given date.
 * Marks each slot as available or taken based on existing bookings.
 */
export async function getAvailableSlots(
  arenaId: number,
  dateStr: string,
): Promise<{ success: boolean; error?: string; data: Slot[] | null }> {
  const arena = await findArenaById(arenaId);
  if (!arena) {
    return { success: false, error: "Arena not found", data: null };
  }

  const [openHour] = arena.openTime.split(":").map(Number);
  const [closeHour] = arena.closeTime.split(":").map(Number);

  // Get existing bookings for this date
  const existingBookings = await findBookingByArenaAndDate(arenaId, dateStr);

  // Build set of taken hours for fast lookup
  const takenHours = new Set<number>();
  for (const booking of existingBookings) {
    const start = new Date(booking.startAt).getHours();
    const end = new Date(booking.endAt).getHours() || 24;
    // Mark all hours in the booking range as taken
    for (let h = start; h < end; h++) {
      takenHours.add(h);
    }
  }

  // Filter past slots if the date is today
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const isToday = dateStr === today;
  const currentHour = now.getHours();
  // Openning 24Hrs
  const is24Hrs = openHour === closeHour;
  const endHour = is24Hrs ? 24 : closeHour;

  // Generate slots
  const slots: Slot[] = [];
  for (let hour = openHour; hour < endHour; hour++) {
    const startTime = String(hour).padStart(2, "0") + ":00";
    const endTime = String(hour + 1).padStart(2, "0") + ":00";

    const isPast = isToday && hour <= currentHour;
    const isTaken = takenHours.has(hour);

    slots.push({
      startHour: hour,
      startTime,
      endTime,
      isAvailable: !isTaken && !isPast,
    });
  }

  return { success: true, data: slots };
}

/**
 * Create a new booking for one or more consecutive hours.
 */
export async function createBooking(
  userId: number,
  arenaId: number,
  dateStr: string,
  startHour: number,
  hours: number,
): Promise<BookingResult> {
  // 1. Validate arena exists
  const arena = await findArenaById(arenaId);
  if (!arena) {
    return { success: false, error: "Arena not found", data: null };
  }

  // 2. Validate within operating hours
  const [openHour] = arena.openTime.split(":").map(Number);
  const [closeHour] = arena.closeTime.split(":").map(Number);
  const endHour = startHour + hours;
  const is24Hrs = openHour === closeHour;

  if (!is24Hrs && (startHour < openHour || endHour > closeHour)) {
    return {
      success: false,
      error: "Slot is outside operating hours",
      data: null,
    };
  }

  // 3. Construct timestamps
  const startAt = new Date(
    `${dateStr}T${String(startHour).padStart(2, "0")}:00:00`,
  );
  const endAt = new Date(
    `${dateStr}T${String(endHour).padStart(2, "0")}:00:00`,
  );

  // 4. Validate not in the past
  if (startAt <= new Date()) {
    return {
      success: false,
      error: "Cannot book a slot in the past",
      data: null,
    };
  }

  // 5. Check for conflicts
  const hasConflict = await findConflictingBooking(arenaId, startAt, endAt);
  if (hasConflict) {
    return { success: false, error: "This slot is already booked", data: null };
  }

  // 6. Calculate total price
  const totalPrice = arena.price * hours;

  // 7. Insert booking
  const booking = await insertBooking(
    userId,
    arenaId,
    startAt,
    endAt,
    totalPrice,
  );

  return { success: true, data: booking };
}

/**
 * Get user's bookings with arena info (paginated)
 */
export async function getUserBookings(
  userId: number,
  page: number,
  limit: number,
): Promise<{
  data: BookingWithArena[];
  totalCount: number;
  hasMore: boolean;
}> {
  const { data, totalCount } = await findBookingsByUserId(userId, page, limit);
  const hasMore = page * limit < totalCount;
  return { data, totalCount, hasMore };
}

/**
 * Get bookings for arenas owned by a company (paginated)
 */
export async function getCompanyBookings(
  companyId: number,
  page: number,
  limit: number,
): Promise<{
  data: (BookingWithArena & { userName: string })[];
  totalCount: number;
  hasMore: boolean;
}> {
  const { data, totalCount } = await findBookingsByCompanyId(
    companyId,
    page,
    limit,
  );
  const hasMore = page * limit < totalCount;
  return { data, totalCount, hasMore };
}

/**
 * Cancel a booking. Only the booking owner can cancel.
 */
export async function cancelBooking(
  userId: number,
  bookingId: number,
  companyId?: number,
): Promise<BookingResult> {
  const booking = await findBookingById(bookingId);
  if (!booking) {
    return { success: false, error: "Booking not found", data: null };
  }

  const isBooker = booking.userId === userId;
  const arena = await findArenaById(booking.arenaId);
  const isArenaOwner = !!companyId && arena?.companyId === companyId;

  if (!isBooker && !isArenaOwner) {
    return {
      success: false,
      error: "Not authorized to cancel this booking",
      data: null,
    };
  }

  if (booking.status === "cancelled") {
    return {
      success: false,
      error: "Booking is already cancelled",
      data: null,
    };
  }

  const updated = await updateBookingStatus(bookingId, "cancelled");
  return { success: true, data: updated };
}
