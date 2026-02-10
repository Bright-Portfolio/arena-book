import { insertArena, searchArenas } from "@/lib/repositories/arena.repo";
import {
  CreateArenaInput,
  CreateArenaOutput,
} from "@/lib/validators/arena.schema";
import { findCompanyById } from "@/lib/repositories/company.repo";

export interface RegisterArenaResult {
  success: boolean;
  error?: string;
  data: CreateArenaOutput | null;
}

// Create new arena
export async function registerArena(
  companyId: number,
  data: CreateArenaInput,
): Promise<RegisterArenaResult> {
  const company = await findCompanyById(companyId);
  if (!company)
    return {
      success: false,
      error: "Company not found",
      data: null,
    };
  const result = await insertArena(companyId, data);

  return {
    success: true,
    data: result,
  };
}

// Search arenas with category (will add the filter func in the future)
export async function searchArenasWithCategory(
  query: string,
  category?: string,
): Promise<CreateArenaOutput[]> {
  const result = await searchArenas(query, category);

  return result;
}
