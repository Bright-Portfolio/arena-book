import { insertArena } from "@/lib/repositories/arena.repo";
import { CreateArenaInput } from "@/lib/validators/arena.schema";

export async function registerArena(
  companyId: number,
  data: CreateArenaInput,
) {
    

    return insertArena(companyId, data);
}
