import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ArenaFormData } from "@/lib/validators/arena.schema";

interface CreateArenaInput {
  data: ArenaFormData;
  arenaId?: number;
}

export function useCreateArena() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data, arenaId }: CreateArenaInput) => {
      const isEdit = !!arenaId;
      const url = isEdit ? `/api/arenas/${arenaId}` : "/api/arenas";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message ?? "Something went wrong");
      }

      const json = await res.json();
      return json.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-arenas"] });
    },
  });
}
