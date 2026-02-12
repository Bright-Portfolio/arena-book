import { useMutation, useQueryClient } from "@tanstack/react-query";

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manage-arenas"] });
    },
  });
}
