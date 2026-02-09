import { z } from "zod";
import { phoneFieldSchema, phoneRefinement } from "./shared.schema";

// Base shape
export const ArenaBaseSchema = phoneFieldSchema.extend({
  name: z.string().min(1, "arena name is required"),
  description: z.string().optional(),
  price: z.number("price is required").min(0, "price can't be negative"),
  capacity: z
    .number("maximum capacity is required")
    .int()
    .min(1, "capacity must be at least 1")
    .optional(),
  openTime: z.string().min(1, "open time is required"), // HH:mm format
  closeTime: z.string().min(1, "close time is required"), // HH:mm format
  category: z.string().min(1, "category is required"),
  address: z.string().min(1, "address is required"),
  imageUrls: z.array(z.url()).optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

// Form schema — superRefine applied last, only for useForm
export const ArenaFormSchema = ArenaBaseSchema.superRefine(phoneRefinement);
export type ArenaFormData = z.infer<typeof ArenaFormSchema>;

// Input schema (form + company relation)
export const CreateArenaInputSchema = ArenaBaseSchema.extend({
  companyId: z.number(),
});

export type CreateArenaInput = z.infer<typeof CreateArenaInputSchema>;

// Output schema
export const CreateArenaOutputSchema = CreateArenaInputSchema.extend({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  deletedAt: z.date().nullable(),
});

export type CreateArenaOutput = z.infer<typeof CreateArenaOutputSchema>;
