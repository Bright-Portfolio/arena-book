
import { upsertCompany } from "@/lib/repositories/company.repo";
import { findUserById, } from "@/lib/repositories/user.repo";
import type {
  CreateCompanyInput,
  CreateCompanyOutput,
} from "@/lib/validators/company.schema";

export async function registerOrUpdateCompany({
  userId,
  data,
}: {
  userId: number;
  data: CreateCompanyInput;
}): Promise<CreateCompanyOutput> {
  const user = await findUserById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return upsertCompany(userId, data);
}
