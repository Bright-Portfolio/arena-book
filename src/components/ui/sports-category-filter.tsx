import { SPORTS } from "@/lib/constants/sports";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface SportsCategoryFilterProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function SportsCategoryFilter({
  value,
  onChange,
}: SportsCategoryFilterProps) {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative w-56">
        <ListboxButton className="flex w-full items-center justify-between rounded-md border border-input px-3 py-2 text-sm shadow-xs hover:bg-accent">
          <span>{value ?? "All Sports"}</span>
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
  );
}
