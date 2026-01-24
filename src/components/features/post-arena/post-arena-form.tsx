import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FormField } from "@/components/ui/form-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { useState } from "react";

const SPORT_CATEGORIES = [
  {
    category: "Team Sports",
    items: ["Football (Soccer)", "Futsal", "Volleyball", "Basketball"],
  },
  {
    category: "Combat Sports",
    items: ["Muay Thai", "Boxing", "MMA"],
  },
  {
    category: "Racquet Sports",
    items: ["Badminton", "Table Tennis", "Tennis"],
  },
  {
    category: "Individual & Fitness",
    items: ["Running", "Cycling", "Swimming", "Gym / Fitness"],
  },
  {
    category: "Precision & Leisure",
    items: ["Golf"],
  },
];

export const PostArenaForm = () => {
  const [selectedSport, setSelectedSport] = useState<string | null>("");
  const [query, setQuery] = useState("");

  const sportFiltered = SPORT_CATEGORIES.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.toLocaleLowerCase().includes(query.toLowerCase()),
    ),
  }));

  return (
    <div className="w-full p-4  bg-white">
      <form className="flex flex-col justify-center items-stretch w-full space-y-4">
        <FormField label="Name" />
        <FormField label="Description" />
        <FormField label="Price" type="number" />
        {/* Time picker */}
        <div className="flex flex-row justify-between items-center gap-2">
          <div className="flex flex-1 flex-col gap-2">
            <Label>Open-time</Label>
            <Input type="time" defaultValue="09:00" className="" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <Label>Close-time</Label>
            <Input type="time" defaultValue="18:00" className="" />
          </div>
        </div>

        {/* Categories */}
        <Combobox
          value={selectedSport}
          onChange={setSelectedSport}
          onClose={() => setQuery("")}
        >
          <div className="flex flex-col justify-start items-start gap-2">
            <Label>Categories</Label>
            <div className="relative w-full">
              <div className="flex flex-row justify-between items-center px-3 py-1 w-full h-9 border border-input rounded-md transition-shadow focus-within:ring-[1px] focus-within:ring-ring/50">
                <ComboboxInput
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full outline-none text-sm"
                  placeholder="Select a sport"
                />
                <ComboboxButton className="p-1 cursor-pointer group">
                  <ChevronDownIcon className="w-4 h-4 transition-transform group-data-open:rotate-180" />
                </ComboboxButton>
              </div>
              <ComboboxOptions
                transition
                className="absolute top-full left-0 mt-1 space-y-1 w-full h-40 p-2 bg-white border rounded-md shadow-lg z-10 overflow-y-auto transition duration-300 origin-top data-closed:scale-y-95 data-closed:opacity-0"
              >
                {sportFiltered.map((group) =>
                  group.items.length > 0 ? (
                    <div key={group.category} className="flex flex-col gap-1">
                      <div className="text-gray-400 font-semibold">
                        {group.category}
                      </div>

                      {group.items.map((item) => (
                        <ComboboxOption
                          key={item}
                          value={item}
                          className="p-1 text-sm rounded-md cursor-pointer hover:bg-gray-100 data-selected:bg-gray-200"
                        >
                          {item}
                        </ComboboxOption>
                      ))}
                    </div>
                  ) : null,
                )}
              </ComboboxOptions>
            </div>
          </div>
        </Combobox>

        {/* Address */}
        <TextareaField label="Address" placeholder="Enter you areana address" />

        {/* Save Button */}
        <button
          type="submit"
          className="mx-auto px-2 py-1 rounded-lg text-white bg-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </form>
    </div>
  );
};
