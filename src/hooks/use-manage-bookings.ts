import { useQuery } from "@tanstack/react-query";
import type { BookingWithArena } from "@/lib/validators/booking.schema";

interface ManageBookingsResponse {
  bookings: (BookingWithArena & { userName: string })[];
  totalCount: number;
  hasMore: boolean;
}

export function useManageBookings(page = 1, limit = 10) {
  return useQuery<ManageBookingsResponse>({
    queryKey: ["manage-bookings", page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      const res = await fetch(`/api/manage/bookings?${params}`);
      if (!res.ok) throw new Error("Failed to fetch company bookings");

      const json = await res.json();

      return {
        bookings: json.data as (BookingWithArena & { userName: string })[],
        totalCount: json.totalCount,
        hasMore: json.hasMore,
      };
    },
  });
}
