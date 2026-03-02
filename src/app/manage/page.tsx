"use client";

import { useState } from "react";
import { ArenaCardList } from "@/components/features/arena-card/arena-card-list";
import { SportsCategoryFilter } from "@/components/ui/sports-category-filter";
import { useManageArenas } from "@/hooks/use-manage-arenas";
import { useDeleteArena } from "@/hooks/use-delete-arena";
import { Pagination } from "@/components/ui/pagination";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export default function ManagePage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const { data, isLoading } = useManageArenas(page, 10, category ?? undefined);
  const { mutate: deleteArena } = useDeleteArena();
  const visibleArenas = data?.arenas ?? [];

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeleteTarget(null);
    deleteArena(deleteTarget.id);
  }

  return (
    <div className="mx-auto max-w-4xl w-full space-y-6 p-4 flex-1 flex flex-col">
      <h1 className="text-2xl font-bold">Your Arenas</h1>

      {/* Category filter dropdown */}
      <SportsCategoryFilter
        value={category}
        onChange={(value) => {
          setCategory(value);
          setPage(1);
        }}
      />

      {/* Arena list */}
      <ArenaCardList
        arenas={visibleArenas}
        isLoading={isLoading}
        onDelete={(id) => {
          const arena = data?.arenas.find((a) => a.id === id);
          if (arena) setDeleteTarget({ id, name: arena.name });
        }}
      />

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Arena"
        description={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Delete"
      />

      {/* Pagination */}
      {data && (
        <Pagination
          page={page}
          hasMore={data.hasMore}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
