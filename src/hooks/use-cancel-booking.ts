import { useQueryClient, useMutation } from "@tanstack/react-query";

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutateFn: async (bookingId: number) => {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify( action: "cancel",id),
       
      });
    },
  });
}
