"use client";

import { useArenas } from "@/hooks/use-arenas";
import { useState } from "react";
import { ArenaCardList } from "@/components/features/arena-card/arena-card-list";
import { Pagination } from "@/components/ui/pagination";
import { SportsCategoryFilter } from "@/components/ui/sports-category-filter";

export default function ExplorePage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | null>(null);

  const { data, isLoading } = useArenas(page, 10, category ?? undefined);

  return (
    <div className="mx-auto w-full max-w-4xl p-4 space-y-6 flex-1 flex flex-col">
      <h1 className="text-2xl font-bold">Explore Arenas</h1>

      {/* Category filter dropdown */}
      <SportsCategoryFilter
        value={category}
        onChange={(value) => {
          setCategory(value);
          setPage(1);
        }}
      />

      {/* Arena list */}
      <ArenaCardList arenas={data?.arenas ?? []} isLoading={isLoading} />

      {/* Pagination */}
      {data && data.arenas.length > 0 && (
        <Pagination
          page={page}
          hasMore={data.hasMore}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
