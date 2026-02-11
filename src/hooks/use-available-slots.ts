import { useQuery } from "@tanstack/react-query";
import type { Slot } from "@/lib/validators/booking.schema";

interface SlotsResponse {
  slots: Slot[];
}

export function useAvailableSlots(arenaId: number, date: string) {
  return useQuery<SlotsResponse>({
    queryKey: ["slots", arenaId, date],
    queryFn: async () => {
      const res = await fetch(`/api/arenas/${arenaId}/slots?date=${date}`);
      if (!res.ok) throw new Error("Failed to fetch available slots");

      const json = await res.json();

      return {
        slots: json.data,
      };
    },
    enabled: !!arenaId && !!date,
  });
}
