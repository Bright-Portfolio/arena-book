"use client";

import { useParams } from "next/navigation";
import { AddArenaForm } from "@/components/features/add-arena/add-arena-form";
import { Spinner } from "@/components/ui/spinner";
import { useArena } from "@/hooks/use-arena";

export default function EditArenaPage() {
  const { id } = useParams<{ id: string }>();
  const arenaIdNum = Number(id);
  const { data: arena, isLoading, error } = useArena(arenaIdNum);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center flex-1">
        <Spinner className="size-6"/>
      </div>
    );
  }

  if (error || !arena) {
    return (
      <div className="flex justify-center items-center flex-1">
        <p className="text-red-500">{error?.message ?? "Arena not found"}</p>
      </div>
    );
  }

  const initialData = {
    name: arena.name,
    description: arena.description ?? "",
    price: arena.price,
    capacity: arena.capacity,
    openTime: arena.openTime,
    closeTime: arena.closeTime,
    category: arena.category,
    address: arena.address,
    phoneCountryISO2: arena.phoneCountryISO2,
    phoneNo: arena.phoneNo,
    imageUrls: arena.imageUrls ?? [],
  };

  return (
    <div className="mx-auto max-w-4xl w-full p-4 flex-1">
      <AddArenaForm arenaId={arenaIdNum} initialData={initialData} />
    </div>
  );
}
