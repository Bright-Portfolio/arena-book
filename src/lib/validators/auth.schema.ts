import { z } from "zod";

// ---- REGISTER -----
export const RegisterSchema = z.object({
  email: z.email("Email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name required"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export interface RegisterOutput {
  id: string;
  email: string;
  name: string;
}

// ---- LOGIN ----
export const LoginSchema = z.object({
  email: z.email("Email required"),
  password: z.string().min(1, "Password required"),
});

export type LoginInput = z.infer<typeof LoginSchema>;
