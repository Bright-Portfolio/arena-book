import { useQuery } from "@tanstack/react-query";
import type { CreateArenaOutput } from "@/lib/validators/arena.schema";

/**
 * For a fetching a single arena result
 */
export function useArena(id: number) {
  return useQuery<CreateArenaOutput>({
    queryKey: ["arena", id],
    queryFn: async () => {
      const res = await fetch(`/api/arenas/${id}`);
      if (!res.ok) throw new Error("Failed to fetch arena");

      const json = await res.json();
      return json.data;
    },
    enabled: !!id,
  });
}
