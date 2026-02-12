import { useQuery } from "@tanstack/react-query";
import type { CreateArenaOutput } from "@/lib/validators/arena.schema";

interface ArenasResponse {
  arenas: CreateArenaOutput[];
  totalCount: number;
  hasMore: boolean;
}

export function useArenas(page = 1, limit = 10, category?: string) {
  return useQuery<ArenasResponse>({
    queryKey: ["arenas", page, category],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      if (category) params.set("category", category);

      const res = await fetch(`/api/arenas?${params}`);
      if (!res.ok) throw new Error("Failed to fecth arenas");

      const json = await res.json();

      return {
        arenas: json.data as CreateArenaOutput[],
        totalCount: json.totalCount,
        hasMore: json.hasMore,
      };
    },
  });
}
