import { z } from "zod";

// ---- REGISTER -----
export const RegisterInput = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().optional(),
});

export type RegisterInput = z.infer<typeof RegisterInput>;

export interface RegisterOutput {
  id: string;
  email: string;
  name: string | null;
}

// ---- LOGIN ----
export const LoginInput = z.object({
  email: z.string(),
  password: z.string().min(1, "Password required"),
});

export type LoginInput = z.infer<typeof LoginInput>;
