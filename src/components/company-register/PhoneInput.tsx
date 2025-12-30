"use client";

import { FC } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
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
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
}

const getCountryName = (code: CountryCode): string => {
  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(code) || code;
  } catch (error) {
    throw new Error(`Invalid country code: ${code}`);
  }
};

const getCountryFlag = (code: CountryCode) => {
  if (code in Flags) {
    return Flags[code as keyof typeof Flags];
  }
  return null;
};

export const PhoneInput: FC<PhoneInputProps> = ({ value, onChange, error }) => {
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
  const [selected, setSelected] = useState<Country>(countries[0]);
  const [phoneNo, setPhoneNo] = useState("");

  const filteredCountries = useMemo(() => {
    if (query === "") return countries;

    return countries.filter((country) => {
      const searchStr = query.toLowerCase();
      return (
        country.name.toLowerCase().includes(searchStr) ||
        country.code.toLocaleLowerCase().includes(searchStr) ||
        country.callingCode.includes(searchStr)
      );
    });
  }, [query, countries]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhone = e.target.value;
    setPhoneNo(newPhone);

    // Combine country code + phone number
    if (onChange) {
      onChange(`${selected.callingCode}${newPhone}`);
    }
  };

  const handleCountryChange = (country: Country) => {
    setSelected(country);

    if (onChange) {
      onChange(`${country.callingCode}${phoneNo}`);
    }
  };

  return (
    <div className="flex flex-row w-full">
      <Combobox>
        <div className="relative">
          <ComboboxInput className={} />
        </div>
      </Combobox>
    </div>
  );
};
