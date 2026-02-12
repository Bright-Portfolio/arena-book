"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useArena } from "@/hooks/use-arena";
import { BookingForm } from "@/components/features/booking/booking-form";
import { Spinner } from "@/components/ui/spinner";

export default function ArenaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: arena, isLoading, isError } = useArena(Number(id));

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (isError || !arena) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <p className="text-sm text-gray-500">Arena not found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Arena details */}
        <div className="flex-1 space-y-4">
          {arena.imageUrls?.[0] && (
            <div className="relative h-64 w-full overflow-hidden rounded-lg">
              <Image
                src={arena.imageUrls[0]}
                alt={arena.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{arena.name}</h1>

            <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              {arena.category}
            </span>

            <p className="text-sm text-gray-600">{arena.address}</p>

            {arena.description && (
              <p className="text-sm text-gray-600">{arena.description}</p>
            )}

            <div className="flex flex-col gap-1 text-sm">
              <p>
                <span className="font-medium">Hours:</span> {arena.openTime} -{" "}
                {arena.closeTime}
              </p>
              <p>
                <span className="font-medium">Price:</span> ฿{arena.price}/hr
              </p>
              {arena.capacity && (
                <p>
                  <span className="font-medium">Capacity:</span>{" "}
                  {arena.capacity}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Booking form */}
        <div className="flex-1">
          <h2 className="mb-4 text-lg font-semibold">Book this arena</h2>
          <BookingForm arenaId={arena.id} price={arena.price} />
        </div>
      </div>
    </div>
  );
}
