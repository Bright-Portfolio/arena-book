import {
  findCompanyByName,
  upsertCompany,
} from "@/lib/repositories/company.repo";
import type {
  CreateCompanyInput,
  CreateCompanyOutput,
} from "@/lib/validators/company.schema";

//Note: Check does this func use for update company or nor if not change the name
export async function registerOrUpdateCompany(
  userId: number,
  data: CreateCompanyInput,
): Promise<CreateCompanyOutput> {
  const existing = await findCompanyByName(data.name);
  if (existing && existing.ownerId !== userId)
    throw new Error("Company name already taken");

  return upsertCompany(userId, data);
}
