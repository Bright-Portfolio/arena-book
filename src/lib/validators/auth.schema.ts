import { z } from "zod";

// ---- REGISTER -----
export const RegisterInputSchema = z.object({
  email: z.email("Email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name required"),
});

export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const RegisterOutputSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
});

export type RegisterOutput = z.infer<typeof RegisterOutputSchema>;

// ---- LOGIN ----
export const LoginSchema = z.object({
  email: z.email("Email required"),
  password: z.string().min(1, "Password required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
