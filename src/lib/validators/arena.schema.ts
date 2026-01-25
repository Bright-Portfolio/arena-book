import { z } from "zod";

// Form validation schema (user-facing fields)
export const ArenaFormSchema = z.object({
  name: z.string().min(1, "arena name is required"),
  description: z.string().optional(),
  price: z.number().min(0, "price must be positive"),
  openTime: z.string().min(1, "open time is required"), // HH:mm format
  closeTime: z.string().min(1, "close time is required"), // HH:mm format
  category: z.string().min(1, "category is required"),
  address: z.string().optional(),
  imageUrl: z.url().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  countryCode: z.string().default("+66"),
  phone: z.string().min(1, "phone is required"),
  capacity: z.number().int().positive().optional(),
});

export type ArenaFormData = z.infer<typeof ArenaFormSchema>;

// Input schema (form + company relation)
export const CreateArenaInputSchema = ArenaFormSchema.extend({
  companyId: z.number(),
});

export type CreateArenaInput = z.infer<typeof CreateArenaInputSchema>;

// Output schema (input + db-generated fields)
export const CreateArenaOutputSchema = CreateArenaInputSchema.extend({
  id: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  deletedAt: z.date().nullable(),
});

export type CreateArenaOutput = z.infer<typeof CreateArenaOutputSchema>;
