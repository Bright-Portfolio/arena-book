"use client";

import { ArenaCardList } from "@/components/features/arena-card/arena-card-list";
import { useManageArenas } from "@/hooks/use-manage-arenas";

export default function ManagePage() {
  const { data, isLoading } = useManageArenas();

  return (
    <div className="mx-auto max-w-4xl">
      <ArenaCardList arenas={data ?? []} isLoading={isLoading} />
    </div>
  );
}
