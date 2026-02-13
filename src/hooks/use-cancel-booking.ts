import { useQueryClient, useMutation } from "@tanstack/react-query";

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: number) => {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });

      if (!res.ok) throw new Error("Booking cancel failed");
      const json = await res.json();

      return json.data;
    },
    onMutate: async (bookingId: number) => {
      // Cancel old refetches to prevent overwrite by stale data
      await queryClient.cancelQueries({ queryKey: ["bookings"] });
      await queryClient.cancelQueries({ queryKey: ["manage-bookings"] });

      // Save snapshots for rollback
      const prevBookings = queryClient.getQueriesData({ queryKey: ["bookings"] });
      const prevManageBookings = queryClient.getQueriesData({ queryKey: ["manage-bookings"] });

      // Helper: set status to "cancelled" in any booking list
      const cancelInList = (old: { bookings: { id: number }[] } | undefined) => {
        if (!old) return old;
        return {
          ...old,
          bookings: old.bookings.map((b) =>
            b.id === bookingId ? { ...b, status: "cancelled" as const } : b,
          ),
        };
      };

      // Fuzzy match: updates ["bookings", 1], ["bookings", 2], etc.
      queryClient.setQueriesData({ queryKey: ["bookings"] }, cancelInList);
      queryClient.setQueriesData({ queryKey: ["manage-bookings"] }, cancelInList);

      return { prevBookings, prevManageBookings };
    },
    onError: (_err, _bookingId, context) => {
      context?.prevBookings.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      context?.prevManageBookings.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["manage-bookings"] });
    },
  });
}
