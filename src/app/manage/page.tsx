"use client";

import { ArenaCardList } from "@/components/features/arena-card/arena-card-list";
import { useManageArenas } from "@/hooks/use-manage-arenas";

export default function ManagePage() {
  const { data, isLoading } = useManageArenas();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">Your Arenas</h1>
      <ArenaCardList arenas={data?.arenas ?? []} isLoading={isLoading} />
    </div>
  );
}
