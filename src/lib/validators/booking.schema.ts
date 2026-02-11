import { z } from "zod";

// Booking status enum
export const BookingStatusEnum = z.enum(["pending", "confirmed", "cancelled"]);
export type BookingStatus = z.infer<typeof BookingStatusEnum>;

// Input schema (what the client sends to create a booking)
export const CreateBookingInputSchema = z.object({
  arenaId: z.number().int().positive("arena ID is required"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be YYYY-MM-DD format"),
  startHour: z
    .number()
    .int()
    .min(0, "invalid start hour")
    .max(23, "invalid start hour"),
  hours: z
    .number()
    .int()
    .min(1, "must book at least 1 hour")
    .max(12, "cannot book more than 12 hours"),
});

export type CreateBookingInput = z.infer<typeof CreateBookingInputSchema>;

// Output schema (what the API returns)
export const BookingOutputSchema = z.object({
  id: z.number(),
  status: BookingStatusEnum,
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  totalPrice: z.number(),
  userId: z.number(),
  arenaId: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().nullable(),
});

export type BookingOutput = z.infer<typeof BookingOutputSchema>;

// Extended output with arena info (for "My Bookings" display)
export const BookingWithArenaSchema = BookingOutputSchema.extend({
  arenaName: z.string(),
  arenaCategory: z.string(),
  arenaAddress: z.string(),
  arenaPrice: z.number(),
});

export type BookingWithArena = z.infer<typeof BookingWithArenaSchema>;

// Slot representation (for available slots API)
export const SlotSchema = z.object({
  startHour: z.number(),
  startTime: z.string(), // "HH:mm"
  endTime: z.string(), // "HH:mm"
  isAvailable: z.boolean(),
});

export type Slot = z.infer<typeof SlotSchema>;
