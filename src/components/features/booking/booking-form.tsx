"use client";

import { FC, useState } from "react";
import { useSession } from "next-auth/react";
import { useAvailableSlots } from "@/hooks/use-available-slots";
import { useCreateBooking } from "@/hooks/use-create-booking";
import { Spinner } from "@/components/ui/spinner";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import clsx from "clsx";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useRouter } from "next/navigation";

interface BoookingFormProps {
  arenaId: number;
  price: number;
}

export const BookingForm: FC<BoookingFormProps> = ({ arenaId, price }) => {
  const { data: session } = useSession();
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const router = useRouter();

  const { data, isLoading } = useAvailableSlots(arenaId, selectedDate);
  const {
    mutate: createBooking,
    isPending,
    isSuccess,
    isError,
    error,
    reset,
  } = useCreateBooking();

  if (!session) {
    return <p className="text-sm text-gray-500">Please sign in to book</p>;
  }

  function handleSlotClick(startHour: number) {
    setSelectedSlots((prev) => {
      if (prev.length === 0) return [startHour];

      const min = Math.min(...prev);
      const max = Math.max(...prev);

      if (prev.includes(startHour)) {
        if (startHour === min || startHour === max) {
          return prev.filter((h) => h !== startHour);
        }
        return prev;
      }

      if (startHour === min - 1 || startHour === max + 1) {
        return [...prev, startHour].sort((a, b) => a - b);
      }

      return [startHour];
    });
  }

  function handleConfirm() {
    createBooking({
      arenaId,
      date: selectedDate,
      startHour: Math.min(...selectedSlots),
      hours: selectedSlots.length,
    });
  }

  function handleReset() {
    setSelectedSlots([]);
    reset();
  }

  return (
    <div className="w-full h-full space-y-4">
      {/* Date picker */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={clsx(
              "w-full flex items-center gap-2 rounded-md border px-3 py-2 text-sm cursor-pointer",
              !selectedDate && "text-gray-400",
            )}
          >
            <CalendarIcon className="size-4" />
            {selectedDate
              ? new Date(selectedDate + "T00:00:00").toLocaleDateString(
                  "en-GB",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )
              : "Select a date"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={
              selectedDate ? new Date(selectedDate + "T00:00:00") : undefined
            }
            onSelect={(date) => {
              if (date) {
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, "0");
                const dd = String(date.getDate()).padStart(2, "0");
                setSelectedDate(`${yyyy}-${mm}-${dd}`);
              } else {
                setSelectedDate("");
              }
              setSelectedSlots([]);
            }}
            disabled={{ before: new Date() }}
          />
        </PopoverContent>
      </Popover>

      {/* Slot grid */}
      {selectedDate &&
        (isLoading ? (
          <div className="flex justify-center py-4">
            <Spinner className="size-6" />
          </div>
        ) : (
          <div className="flex flex-wrap justify-center items-center gap-2">
            {data?.slots.map((slot) => {
              const isSelected = selectedSlots.includes(slot.startHour);

              return (
                <button
                  key={slot.startHour}
                  disabled={!slot.isAvailable}
                  onClick={() => handleSlotClick(slot.startHour)}
                  className={clsx(
                    "rounded-md px-2 py-1.5 text-sm transition-colors",
                    !slot.isAvailable &&
                      "bg-gray-100 text-gray-400 line-through cursor-not-allowed",
                    slot.isAvailable && isSelected && "bg-black text-white",
                    slot.isAvailable &&
                      !isSelected &&
                      "border hover:bg-gray-50 cursor-pointer",
                  )}
                >
                  {slot.startTime} - {slot.endTime}
                </button>
              );
            })}
          </div>
        ))}

      {/* Summary + Confirm */}
      {selectedSlots.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-700">
            {selectedSlots.length} hour(s) × ฿{price} = ฿
            {selectedSlots.length * price}
          </p>

          {isError && <p className="text-sm text-red-600">{error.message}</p>}

          <button
            onClick={handleConfirm}
            disabled={isPending}
            className="w-full rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50 cursor-pointer"
          >
            {isPending ? "Booking..." : "Confirm Booking"}
          </button>
        </div>
      )}

      {/* Success dialog */}
      <Dialog
        open={isSuccess}
        onClose={() => reset()}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold">
              Booking Confirmed!
            </DialogTitle>
            <p className="mt-2 text-sm text-gray-600">
              Your booking has been created successfully.
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => handleReset()}
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 cursor-pointer"
              >
                Book another slot
              </button>
              <button
                onClick={() => router.push("/bookings")}
                className="rounded-md bg-black px-3 py-1.5 text-sm text-white cursor-pointer"
              >
                My Bookings
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};
