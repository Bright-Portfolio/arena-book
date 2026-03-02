"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useManageBookings } from "@/hooks/use-manage-bookings";
import { useCancelBooking } from "@/hooks/use-cancel-booking";
import { BookingList } from "@/components/features/booking/booking-list";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Pagination } from "@/components/ui/pagination";

export default function ManageBookingsPage() {
  const { data: session } = useSession();
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState<number | null>(null);

  const { data, isLoading } = useManageBookings(page, 10);
  const { mutate: cancelBooking } = useCancelBooking();

  function handleCancelConfirm() {
    if (!cancelTarget) return;

    setCancelTarget(null);

    cancelBooking(cancelTarget);
  }

  if (session?.user?.role !== "owner") {
    return (
      <div className="flex justify-center items-center flex-1">
        <p className="text-sm text-gray-500">Unauthorized</p>
      </div>
    );
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
        <h1 className="text-2xl font-bold">Manage Bookings</h1>
        <p className="mt-4 text-sm text-gray-500">No bookings yet</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 w-full space-y-6 flex-1">
      <h1 className="text-2xl font-bold">Manage Bookings</h1>

      <div>
        {data.bookings.map((booking) => (
          <BookingList
            key={booking.id}
            booking={booking}
            showUserName={true}
            onCancel={(id) => setCancelTarget(id)}
          />
        ))}
      </div>

      {/* Cancel confirmation dialog */}
      <Dialog
        open={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold">
              Cancel Booking
            </DialogTitle>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to cancel this booking? This action cannot
              be undone.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 cursor-pointer"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancelConfirm}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 cursor-pointer"
              >
                Cancel Booking
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Pagination */}
      <Pagination
        page={page}
        hasMore={data.hasMore}
        onPageChange={setPage}
      />
    </div>
  );
}
