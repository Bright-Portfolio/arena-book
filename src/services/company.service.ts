import {
  findCompanyByName,
  upsertCompany,
} from "@/lib/repositories/company.repo";
import type {
  CreateCompanyInput,
  CreateCompanyOutput,
} from "@/lib/validators/company.schema";

export async function registerOrUpdateCompany(
  userId: number,
  data: CreateCompanyInput,
): Promise<CreateCompanyOutput> {
  const existing = await findCompanyByName(data.name);
  if (existing) throw new Error("Company name already taken");

  return upsertCompany(userId, data);
}
