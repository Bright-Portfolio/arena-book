"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AddArenaForm } from "@/components/features/add-arena/add-arena-form";
import type { ArenaFormData } from "@/lib/validators/arena.schema";

export default function EditArenaPage() {
  const [initialData, setInitialData] = useState<ArenaFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const arenaIdNum = Number(id);

  
  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError("Invalid arena ID");
      setIsLoading(false);
      return;
    }

    async function fetchArena() {
      try {
        const res = await fetch(`/api/arenas/${id}`);
        if (!res.ok) {
          setError("Arena not found");
          return;
        }
        const json = await res.json();
        const arena = json.data;
        
        setInitialData({
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
        });
      } catch {
        setError("Failed to load arena");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchArena();
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error || !initialData) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full h-screen">
      <AddArenaForm arenaId={arenaIdNum} initialData={initialData} />
    </div>
  );
}
