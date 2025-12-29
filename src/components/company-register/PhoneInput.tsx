import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

export const PhoneInput = () => {
  return (
    <div className="flex flex-row w-full">
      <input type="text" placeholder="Country code" />
      <input type="text" placeholder="Phone no." />
    </div>
  );
};
