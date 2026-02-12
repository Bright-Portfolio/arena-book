import { useQuery } from "@tanstack/react-query";
import type { BookingWithArena } from "@/lib/validators/booking.schema";

interface BookingsResponse {
  bookings: BookingWithArena[];
  totalCount: number;
  hasMore: boolean;
}

export function useBookings(page = 1, limit = 10) {
  return useQuery<BookingsResponse>({
    queryKey: ["bookings", page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      const res = await fetch(`/api/bookings?${params}`);
      if (!res.ok) throw new Error("Failed to fetch bookings");

      const json = await res.json();

      return {
        bookings: json.data as BookingWithArena[],
        totalCount: json.totalCount,
        hasMore: json.hasMore,
      };
    },
  });
}
