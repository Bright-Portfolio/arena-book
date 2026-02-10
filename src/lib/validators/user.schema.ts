import { z } from "zod";

export type UserRole = "user" | "owner";
export type AuthProviderType = "credentials" | "google";

export const CreateUserInputSchema = z.object({
  email: z.string(),
  password: z.string().optional(),
  name: z.string().optional(),
  imageUrl: z.string().optional(),
  authProvider: z.enum(["credentials", "google"]),
});

export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

export type CreateUserOutput = {
  id: number;
  email: string;
  password: string | null;
  name: string;
  imageUrl: string | null;
  role: UserRole;
  authProvider: AuthProviderType;
};
