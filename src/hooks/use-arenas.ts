import { useQuery } from "@tanstack/react-query";
import type { CreateArenaOutput } from "@/lib/validators/arena.schema";

interface ArenaResponse {
  success: boolean;
  data: CreateArenaOutput[];
  totalCount: number;
  hasMore: boolean;
}

export function useArena(page = 1, limit = 10, category?: string) {
  return useQuery<ArenaResponse>({
    queryKey: ["arenas"],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (category) params.set("category", category);

      const res = await fetch(`/api/arenas?${params}`);
      if (!res.ok) throw new Error("Failed to fecth arenas");
      return res.json();
    },
  });
}
