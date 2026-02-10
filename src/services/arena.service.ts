import {
  findArenaByName,
  insertArena,
  searchArenas,
} from "@/lib/repositories/arena.repo";
import {
  CreateArenaInput,
  CreateArenaOutput,
} from "@/lib/validators/arena.schema";
export interface RegisterArenaResult {
  success: boolean;
  error?: string;
  field?: string;
  data: CreateArenaOutput | null;
}

// Create new arena
export async function registerArena(
  companyId: number,
  data: CreateArenaInput,
): Promise<RegisterArenaResult> {
  const existing = await findArenaByName(data.name);
  if (existing)
    return {
      success: false,
      error: "Arena name already taken",
      field: "name",
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
