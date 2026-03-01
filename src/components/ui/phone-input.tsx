"use client";

import { FC } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
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
import dynamic from "next/dynamic";
import { hasFlag } from "country-flag-icons";
import {
  getCountryCallingCode,
  getCountries,
  type CountryCode,
} from "libphonenumber-js";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";


interface Country {
  code: CountryCode;
  name: string;
  callingCode: string;
}

interface PhoneInputProps {
  label?: string;
  value: { phoneCountryISO2: string; phoneNo: string };
  onChange: (value: { phoneCountryISO2: string; phoneNo: string }) => void;
  error?: string;
  labelClassName?: string;
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
const getCountryName = (code: CountryCode): string => {
  try {
    return regionNames.of(code) || code;
  } catch {
    return code;
  }
};

const flagCache = new Map<string, React.ComponentType<{ className?: string }>>();

const CountryFlag: FC<{ code: CountryCode; className?: string }> = ({
  code,
  className,
}) => {
  if (!hasFlag(code)) return null;

  if (!flagCache.has(code)) {
    flagCache.set(
      code,
      dynamic(() =>
        import("country-flag-icons/react/3x2").then((mod) => mod[code]),
      ),
    );
  }

  const Flag = flagCache.get(code)!;
  return <Flag className={className} />;
};

export const PhoneInput: FC<PhoneInputProps> = ({
  label,
  value,
  onChange,
  error,
  labelClassName,
}) => {
  const countries: Country[] = useMemo(() => {
    const allCountries = getCountries();

    return allCountries.map((code) => ({
      code,
      name: getCountryName(code),
      callingCode: getCountryCallingCode(code),
    }));
  }, []);

  const [query, setQuery] = useState("");
  // Find selected country from countryCode props
  const selected = useMemo(() => {
    return (
      countries.find((c) => c.code === value.phoneCountryISO2) || countries[0]
    );
  }, [countries, value.phoneCountryISO2]);

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
    onChange({ ...value, phoneCountryISO2: country.code });
  };

  //Tanstack Virtualizer
  const [listEl, setListEl] = useState<HTMLDivElement | null>(null);

  const virtualizer = useVirtualizer({
    count: filteredCountries.length,
    getScrollElement: () => listEl,
    estimateSize: () => 32,
    overscan: 20,
  });

  return (
    <div className="flex- flex-col justify-start items-center w-full">
      {label && (
        <label
          htmlFor="phone-input"
          className={cn("text-sm text-black", labelClassName)}
        >
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
                  <CountryFlag code={selected.code} className="w-6 h-6" />
                  <span>+{selected.callingCode}</span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-gray-300 transition ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </ComboboxButton>

                <ComboboxOptions className="absolute z-[60] top-full left-0 mt-1 w-40 rounded-lg bg-white border border-gray-300 shadow-lg">
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
                    <div ref={setListEl} className="max-h-48 overflow-y-auto">
                      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
                        {virtualizer.getVirtualItems().map((virtualRow) => {
                          const country = filteredCountries[virtualRow.index];
                          return (
                            <ComboboxOption
                              key={country.code}
                              value={country}
                              className="group absolute w-full flex flex-row justify-start items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-100 data-focus:bg-gray-100"
                              style={{ top: virtualRow.start, height: virtualRow.size }}
                            >
                              <CountryFlag code={country.code} className="w-6 h-4" />
                              <span className="text-sm flex-1">
                                ({country.code}) +{country.callingCode}
                              </span>
                              <CheckIcon className="invisible w-3 h-3 stroke-2 text-black group-data-selected:visible" />
                            </ComboboxOption>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </ComboboxOptions>
              </div>
              </>
          )}
        </Combobox>
        <input
          type="tel"
          value={value.phoneNo}
          className={`flex-1 px-2 py-1 w-full border rounded-lg rounded-l-none outline-none focus:ring-[1px] ring-input 
            ${error ? "border-red-500" : "border-gray-300"}
            `}
          placeholder="Enter phone number"
          onChange={handlePhoneChange}
        />
      </div>

      {error && <p className="text-sm text-red-500 leading-none">{error}</p>}
    </div>
  );
};
