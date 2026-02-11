import {
  findArenaById,
  findArenaByName,
  findArenas,
  insertArena,
  softDeleteArena,
  updateArena as repoUpdateArena,
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

export async function getArenaById(
  id: number,
): Promise<CreateArenaOutput | null> {
  return findArenaById(id);
}

export async function updateArena(
  companyId: number,
  arenaId: number,
  data: CreateArenaInput,
): Promise<RegisterArenaResult> {
  const arena = await findArenaById(arenaId);
  if (!arena || arena.companyId !== companyId) {
    return { success: false, error: "Arena not found", data: null };
  }

  const existing = await findArenaByName(data.name);
  if (existing && existing.name.toLowerCase() !== arena.name.toLowerCase()) {
    return {
      success: false,
      error: "Arena name already taken",
      field: "name",
      data: null,
    };
  }

  const result = await repoUpdateArena(arenaId, data);
  return { success: true, data: result };
}

export async function deleteArena(
  companyId: number,
  arenaId: number,
): Promise<{ success: boolean; error?: string }> {
  const arena = await findArenaById(arenaId);
  if (!arena || arena.companyId !== companyId) {
    return { success: false, error: "Arena not found" };
  }

  await softDeleteArena(arenaId);
  return { success: true };
}
