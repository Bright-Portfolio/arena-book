import { useQuery } from "@tanstack/react-query";
import type { CreateArenaOutput } from "@/lib/validators/arena.schema";

export function useManageArenas() {
  return useQuery<CreateArenaOutput[]>({
    queryKey: ["manage-arenas"],
    queryFn: async () => {
      const res = await fetch("/api/manage");

      if (!res.ok) {
        throw new Error("Failed to fetch company's arenas");
      }

      const json = await res.json();
      return json.data;
    },
  });
}
