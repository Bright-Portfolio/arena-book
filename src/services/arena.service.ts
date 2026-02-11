import {
  findArenaByName,
  findArenas,
  insertArena,
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

export async function getArenas(
  page: number,
  limit: number,
  companyId?: number,
  category?: string,
): Promise<{
  data: CreateArenaOutput[];
  totalCount: number;
  hasMore: boolean;
}> {
  const { data, totalCount } = await findArenas(page, limit, companyId, category);
  const hasMore = page * limit < totalCount;

  return { data, totalCount, hasMore };
}
