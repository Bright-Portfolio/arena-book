"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/24/outline";

const phoneCodes = [
  { id: 1, code: "+1", country: "US" },
  { id: 2, code: "+1", country: "CA" },
  { id: 3, code: "+44", country: "GB" },
  { id: 4, code: "+61", country: "AU" },
  { id: 5, code: "+81", country: "JP" },
  { id: 6, code: "+82", country: "KR" },
  { id: 7, code: "+86", country: "CN" },
  { id: 8, code: "+91", country: "IN" },
  { id: 9, code: "+65", country: "SG" },
  { id: 10, code: "+66", country: "TH" },
  { id: 11, code: "+84", country: "VN" },
  { id: 12, code: "+60", country: "MY" },
  { id: 13, code: "+63", country: "PH" },
  { id: 14, code: "+62", country: "ID" },
  { id: 15, code: "+49", country: "DE" },
  { id: 16, code: "+33", country: "FR" },
  { id: 17, code: "+39", country: "IT" },
  { id: 18, code: "+34", country: "ES" },
  { id: 19, code: "+55", country: "BR" },
  { id: 20, code: "+52", country: "MX" },
];

export const PhoneInput = () => {
  const [selected, setSelected] = useState(phoneCodes[11]);

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="phone-input" className="text-sm leading-none">
        Phone
      </label>
      <div className=" relative flex flex-row justify-center items-center px-3 py-1 w-full h-9 border border-gray-200 rounded-lg text-sm">
        {/* Phone code list */}
        <Listbox value={selected} onChange={setSelected}>
          <ListboxButton className="group flex justify-between items-center gap-1 p-1 w-20 rounded-lg outline-none">
            {selected.code}
            <ChevronDownIcon className="w-4 h-4 transition-transform duration-200 group-data-open:rotate-180" />
          </ListboxButton>

          <ListboxOptions
            transition
            className="absolute bottom-full left-0 z-50 space-y-0.5 mb-1 p-1 w-24 h-40 border boreder-gray-200 rounded-lg bg-white transition duration-200 ease-in-out origin-top data-closed:scale-y-95 data-closed:opacity-0 overflow-y-auto outline-none"
          >
            {phoneCodes.map((phoneCode) => (
              <ListboxOption
                key={phoneCode.id}
                value={phoneCode}
                className="group flex flex-row justify-between items-center gap-1 p-1 text-black data-selected:bg-gray-200 hover:bg-gray-100 rounded-md cursor-pointer"
              >
                {phoneCode.code}
                <CheckIcon className="invisible group-data-selected:visible size-4" />
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Listbox>

        <span className="w-px h-6 bg-gray-200 mx-2" />

        {/* Input phone no */}
        <input id="phone-input" type="phone" className="w-full outline-none" />
      </div>
    </div>
  );
};
