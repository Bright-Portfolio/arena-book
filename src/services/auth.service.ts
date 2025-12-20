import { hash, compare } from "bcryptjs";
import { createUser, findUserByEmail } from "../lib/repositories/user.repo";
import type {
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
    throw new Error("This email already registeres");
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
