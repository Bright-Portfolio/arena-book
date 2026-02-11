"use client";

import { useState } from "react";
import { SPORTS } from "@/lib/constants/sports";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { ArenaCardList } from "@/components/features/arena-card/arena-card-list";
import { useManageArenas } from "@/hooks/use-manage-arenas";

export default function ManagePage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string | null>(null);

  const { data, isLoading } = useManageArenas(page, 10, category ?? undefined);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">Your Arenas</h1>

      {/* Category filter dropdown */}
      <Listbox
        value={category}
        onChange={(value) => {
          setCategory(value);
          setPage(1);
        }}
      >
        <div className="relative w-56">
          <ListboxButton className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm shadow-xs hover:bg-accent">
            <span>{category ?? "All Sports"}</span>
            <ChevronDownIcon className="size-4" />
          </ListboxButton>
          <ListboxOptions
            transition
            className="absolute z-50 mt-1 w-full max-h-60 overflow-y-auto rounded-md border bg-white p-1 shadow-lg transition duration-200 origin-top data-closed:scale-y-95 data-closed:opacity-0"
          >
            <ListboxOption
              value={null}
              className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm data-focus:bg-gray-100 data-selected:font-medium"
            >
              All Sports
              <CheckIcon className="invisible size-4 data-selected:visible" />
            </ListboxOption>
            {SPORTS.map((sport) => (
              <ListboxOption
                key={sport}
                value={sport}
                className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm data-focus:bg-gray-100 data-selected:font-medium"
              >
                {sport}
                <CheckIcon className="invisible size-4 data-selected:visible" />
              </ListboxOption>
            ))}
          </ListboxOptions>
        </div>
      </Listbox>

      {/* Arena list */}
      <ArenaCardList arenas={data?.arenas ?? []} isLoading={isLoading} />

      {/* Pagination */}
      {data && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!data.hasMore}
            className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
