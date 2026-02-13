import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ManageArenasData {
  arenas: { id: number }[];
  totalCount: number;
  hasMore: boolean;
}

export function useDeleteArena() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (arenaId: number) => {
      const res = await fetch(`/api/arenas/${arenaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "soft-delete" }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message ?? "Failed to delete arena");
      }

      return json.data;
    },
    onMutate: async (arenaId: number) => {
      await queryClient.cancelQueries({ queryKey: ["manage-arenas"] });

      const prevArenas = queryClient.getQueriesData<ManageArenasData>({
        queryKey: ["manage-arenas"],
      });

      queryClient.setQueriesData<ManageArenasData>(
        { queryKey: ["manage-arenas"] },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            arenas: old.arenas.filter((a) => a.id !== arenaId),
          };
        },
      );

      return { prevArenas };
    },
    onError: (_err, _arenaId, context) => {
      context?.prevArenas.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-arenas"] });
    },
  });
}
