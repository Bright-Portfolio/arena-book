import { FC } from "react";
import type { BookingWithArena } from "@/lib/validators/booking.schema";

interface BookingCardProps {
  booking: BookingWithArena & { userName?: string };
  onCancel?: (id: number) => void;
  showUserName?: boolean;
}

export const BookingList: FC<BookingCardProps> = ({
  booking,
  onCancel,
  showUserName,
}) => {
  // Format dates
  const startDate = new Date(booking.startAt);
  const endDate = new Date(booking.endAt);

  const dateStr = startDate.toLocaleDateString("en-GB");
  const timeStr = `${startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

  // Status badge color
  const statusStyles = {
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };
  return (
    <div className="flex items-center justify-between border-b py-3">
      {/* Left side: info */}
      <div className="space-y-0.5">
        <p className="font-medium">{booking.arenaName}</p>
        <p className="text-sm text-gray-500">
          {dateStr} · {timeStr}
        </p>
        {showUserName && booking.userName && (
          <p className="text-xs text-gray-400">{booking.userName}</p>
        )}
      </div>

      {/* Right side: status + price + cancel */}
      <div className="flex items-center gap-3">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[booking.status]}`}
        >
          {booking.status}
        </span>
        <p className="text-sm font-medium">฿{booking.totalPrice}</p>
        {onCancel && booking.status === "confirmed" && (
          <button
            onClick={() => onCancel(booking.id)}
            className="text-sm text-red-600 hover:text-red-700 cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
