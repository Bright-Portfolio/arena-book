"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

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
    <div>
      <Listbox value={selected} onChange={setSelected}>
        <ListboxButton>
          {selected.code}
          <ChevronDownIcon />
        </ListboxButton>

        <ListboxOptions>
          {phoneCodes.map((phoneCode) => (
            <ListboxOption key={phoneCode.id} value={phoneCode.country}>{phoneCode.code}</ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  );
};
