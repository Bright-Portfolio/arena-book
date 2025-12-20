import { hash, compare } from "bcryptjs";
import { createUser, findUserByEmail } from "../lib/repositories/user.repo";
import type {
  LoginInput,
  RegisterInput,
  RegisterOutput,
} from "../lib/validators/auth.schema";

// ---- REGISTER ----
export async function registerUser(
  input: RegisterInput
): Promise<RegisterOutput> {
  // Check if exists
  const exist = await findUserByEmail(input.email);

  if (!exist) {
    throw new Error("Email already registered");
  }

  // Hash password
  const hashedPassword = await hash(input.password, 10);

  // Create new user
  const user = await createUser({
    email: input.email,
    password: hashedPassword,
    name: input.name,
    authProvider: "credentials",
  });

  return {
    id: user.id.toString(),
    email: user.email,
    name: user.name,
  };
}

// ----- SIGNIN (for NextAuth) -----
export async function validateCredentials(
  input: LoginInput
): Promise<RegisterOutput | null> {
  const user = await findUserByEmail(input.email);

  if (!user || !user.password) return null;

  const isValidPassword = await compare(input.password, user.password);
  if (!isValidPassword) return null;

  return {
    id: user.id.toString(),
    email: user.email,
    name: user.name,
  };
}

// ---- GOOGLE OAUTH -----
export async function handleGoogleUser(email: string, name: string) {
  const existing = await findUserByEmail(email);

  if (!existing) {
    await createUser({ email, name, authProvider: "google" });
  }
}
