"use client";

import { useState } from "react";
import { useBookings } from "@/hooks/use-bookings";
import { useCancelBooking } from "@/hooks/use-cancel-booking";
import { BookingList } from "@/components/features/booking/booking-list";
import { Spinner } from "@/components/ui/spinner";
import { Pagination } from "@/components/ui/pagination";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function MyBookingsPage() {
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState<number | null>(null);

  const { data, isLoading } = useBookings(page, 10);
  const { mutate: cancelBooking } = useCancelBooking();

  function handleCancelConfirm() {
    if (!cancelTarget) return;

    setCancelTarget(null);

    cancelBooking(cancelTarget);
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center flex-1">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!data?.bookings.length) {
    return (
      <div className="mx-auto max-w-4xl p-4 w-full">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="mt-4 text-sm text-gray-500">No bookings yet</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 space-y-6 w-full flex-1">
      <h1 className="text-2xl font-bold">My Bookings</h1>

      {/* Booking list */}
      <div>
        {data.bookings.map((booking) => (
          <BookingList
            key={booking.id}
            booking={booking}
            onCancel={(id) => setCancelTarget(id)}
          />
        ))}
      </div>

      {/* Cancel confirmation dialog */}
      <ConfirmDialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        onConfirm={handleCancelConfirm}
        title="Cancel Booking"
        description="Are you sure you want to cancel this booking? This action cannot be undone."
        cancelLabel="Keep Booking"
        confirmLabel="Cancel Booking"
      />

      {/* Pagination */}
      <Pagination
        page={page}
        hasMore={data.hasMore}
        onPageChange={setPage}
      />
    </div>
  );
}
