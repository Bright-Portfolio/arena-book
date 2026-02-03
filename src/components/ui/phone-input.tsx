"use client";

import { FC } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import * as Flags from "country-flag-icons/react/3x2";
import {
  getCountryCallingCode,
  getCountries,
  type CountryCode,
} from "libphonenumber-js";
import { useMemo, useState } from "react";

interface Country {
  code: CountryCode;
  name: string;
  callingCode: string;
  flag: React.ComponentType<{ className?: string }> | null;
}

interface PhoneInputProps {
  label?: string;
  value: { countryCode: string; phoneNo: string };
  onChange: (value: { countryCode: string; phoneNo: string }) => void;
  error?: string;
}

const getCountryName = (code: CountryCode): string => {
  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(code) || code;
  } catch {
    return code;
  }
};

const getCountryFlag = (code: CountryCode) => {
  if (code in Flags) {
    return Flags[code as keyof typeof Flags];
  }
  return null;
};

export const PhoneInput: FC<PhoneInputProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  const countries: Country[] = useMemo(() => {
    const allCountries = getCountries();

    return allCountries.map((code) => ({
      code,
      name: getCountryName(code),
      callingCode: getCountryCallingCode(code),
      flag: getCountryFlag(code),
    }));
  }, []);

  const [query, setQuery] = useState("");
  // Find selected country from countryCode props
  const selected = useMemo(() => {
    return (
      countries.find((c) => `+${c.callingCode}` === value.countryCode) ||
      countries[0]
    );
  }, [countries, value.countryCode]);

  const filteredCountries = useMemo(() => {
    if (query === "") return countries;

    return countries.filter((country) => {
      const searchStr = query.toLowerCase();
      return (
        country.name.toLowerCase().includes(searchStr) ||
        country.code.toLowerCase().includes(searchStr) ||
        country.callingCode.includes(searchStr)
      );
    });
  }, [query, countries]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    onChange({ ...value, phoneNo: newPhone });
  };

  const handleCountryChange = (country: Country | null) => {
    if (!country) return;
    onChange({ ...value, countryCode: `+${country.callingCode}` });
  };

  return (
    <div className="flex- flex-col justify-start items-center w-full">
      {label && (
        <label htmlFor="phone-input" className="text-xs text-black">
          {label}
        </label>
      )}

      <div className="flex flex-row">
        <Combobox
          value={selected}
          onChange={handleCountryChange}
          onClose={() => setQuery("")}
        >
          {({ open }) => (
            <>
              <div className="relative">
                <ComboboxButton className="flex justify-between items-center gap-1 px-2 py-1 border border-gray-300 border-r-0 text-sm text-nowrap rounded-lg rounded-r-none outline-none cursor-pointer data-focus:border-black data-focus:border-r data-active:shadow-inner transition-all duration-75">
                  {selected.flag && <selected.flag className="w-6 h-6" />}
                  <span>+{selected.callingCode}</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-300 transition ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </ComboboxButton>
              </div>

              <ComboboxOptions className="absolute z-10 mt-9 space-y-1 max-h-48 w-40 overflow-y-auto rounded-lg bg-white border border-gray-300 shadow-lg">
                <div
                  className="sticky top-0 bg-white border-b border-gray-200 p-2"
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-row justify-start items-center px-2 py-1 w-full border border-gray-300 rounded-md">
                    <MagnifyingGlassIcon className="w-4 h-4 stroke-2 text-gray-400" />
                    <input
                      type="text"
                      className="w-full px-2 py-1 outline-none text-sm"
                      placeholder="Search..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </div>
                </div>
                {filteredCountries.length === 0 ? (
                  <div className="px-2 py-1 text-center text-sm text-gray-400">
                    No countries found
                  </div>
                ) : (
                  filteredCountries.map((country) => (
                    <ComboboxOption
                      key={country.code}
                      value={country}
                      className="group flex flex-row justify-start items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100 data-focus:bg-gray-100"
                    >
                      {country.flag && <country.flag className="w-6 h-4" />}
                      <span className="text-sm flex-1">
                        ({country.code}) +{country.callingCode}
                      </span>
                      <CheckIcon className="invisible  w-3 h-3 stroke-2 text-black group-data-selected:visible" />
                    </ComboboxOption>
                  ))
                )}
              </ComboboxOptions>
            </>
          )}
        </Combobox>
        <input
          type="tel"
          value={value.phoneNo}
          className="flex-1 px-2 py-1 w-full border border-gray-300 rounded-lg rounded-l-none outline-none focus:border-black"
          placeholder="Enter phone number"
          onChange={handlePhoneChange}
        />
      </div>

      {error && <p className="">{error}</p>}
    </div>
  );
};
