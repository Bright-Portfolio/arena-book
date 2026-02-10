"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { FormField } from "@/components/ui/form-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { ArenaFormData, ArenaFormSchema } from "@/lib/validators/arena.schema";
import { PhoneInput } from "@/components/ui/phone-input";
import { ImageUploadArea } from "@/components/ui/image-upload-area";

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

export const AddArenaForm = () => {
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const {
    handleSubmit,
    register,
    setError,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ArenaFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      price: undefined,
      capacity: undefined,
      openTime: "09:00",
      closeTime: "18:00",
      category: "",
      address: "",
      phoneCountryISO2: "TH",
      phoneNo: "",
      imageUrls: [] as string[],
    },
  });

  const sportFiltered = SPORT_CATEGORIES.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.toLocaleLowerCase().includes(query.toLowerCase()),
    ),
  }));

  const onSubmit = async (data: ArenaFormData) => {
    try {
      const response = await fetch("/api/arenas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, imageUrls }),
      });

      if (!response.ok) {
        const result = await response.json();

        if (result.field) {
          setError(result.field, { message: result.message });
          return;
        } else {
          setError("root", {
            message: result.message || "Something went wrong",
          });
          return;
        }
      }

      // onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("root", { message: "Network error. Please try again." });
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4 bg-white overflow-y-auto">
      <h3 className="text-center text-lg font-semibold">Create Arena Form</h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-stretch w-full space-y-4"
      >
        {/* Name */}
        <FormField
          label="Name"
          error={errors.name?.message}
          {...register("name")}
        />
        {/* Description */}
        <FormField
          label="Description"
          error={errors.description?.message}
          {...register("description")}
        />
        {/* Price */}
        <FormField
          label="Price per hour"
          type="number"
          placeholder={"0"}
          min={0}
          error={errors.price?.message}
          {...register("price", { valueAsNumber: true })}
        />
        {/* Maximum capacity */}
        <FormField
          label="Maximum capacity"
          type="number"
          placeholder={"0"}
          min={1}
          error={errors.capacity?.message}
          {...register("capacity", { valueAsNumber: true })}
        />

        {/* Time picker */}
        <div className="flex flex-row justify-between items-center gap-2">
          {/* open time */}
          <div className="flex flex-1 flex-col gap-1">
            <Label>Open-time</Label>
            <Input
              type="time"
              defaultValue="09:00"
              className=""
              {...register("openTime")}
            />
            <p className="text-sm text-red-500 leading-none">
              {" "}
              {errors.openTime?.message}
            </p>
          </div>
          {/* close time */}
          <div className="flex flex-1 flex-col gap-1">
            <Label>Close-time</Label>
            <Input
              type="time"
              defaultValue="18:00"
              className=""
              {...register("closeTime")}
            />
            <p className="text-sm text-red-500 leading-none">
              {" "}
              {errors.closeTime?.message}
            </p>
          </div>
        </div>

        {/* Categories */}
        <Combobox
          value={selectedSport}
          onChange={(value) => {
            setSelectedSport(value);
            setValue("category", value || "", { shouldValidate: true });
          }}
          onClose={() => setQuery("")}
        >
          <div className="flex flex-col justify-start items-start gap-1">
            <Label>Categories</Label>
            <div className="relative w-full">
              <div
                className={`flex flex-row justify-between items-center px-3 py-1 w-full h-9 border rounded-md transition-shadow focus-within:ring-[1px] focus-within:ring-ring/50
                ${errors.category ? "border-red-500" : "border-input"}
                `}
              >
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
                className="absolute z-[60] top-full left-0 mt-1 space-y-0.5 w-full h-40 p-1 bg-white border rounded-md shadow-lg overflow-y-auto transition duration-300 origin-top data-closed:scale-y-95 data-closed:opacity-0"
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
                          className="group flex flex-row justify-between items-center gap-1 p-1 text-sm rounded-md text-black cursor-pointer hover:bg-gray-100 data-selected:bg-gray-200"
                        >
                          {item}
                          <CheckIcon className="invisible group-data-selected:visible size-4" />
                        </ComboboxOption>
                      ))}
                    </div>
                  ) : null,
                )}
              </ComboboxOptions>
            </div>
            {errors.category && (
              <p className="text-sm text-red-500 leading-none">
                {errors.category.message}
              </p>
            )}
          </div>
        </Combobox>

        {/* Phone input */}
        <Controller
          name="phoneCountryISO2"
          control={control}
          render={({ field: countryField }) => (
            <Controller
              name="phoneNo"
              control={control}
              render={({ field: phoneField }) => (
                <PhoneInput
                  label="Arena phone number"
                  labelClassName="text-sm"
                  error={errors.phoneNo?.message}
                  value={{
                    phoneCountryISO2: countryField.value,
                    phoneNo: phoneField.value,
                  }}
                  onChange={(newValue) => {
                    countryField.onChange(newValue.phoneCountryISO2);
                    phoneField.onChange(newValue.phoneNo);
                  }}
                />
              )}
            />
          )}
        />

        {/* Address */}
        <Controller
          name="address"
          control={control}
          render={({ field, fieldState }) => (
            <TextareaField
              label="Address"
              placeholder="Enter you areana address"
              error={fieldState.error?.message}
              {...field}
            />
          )}
        />

        {/* Upload images */}
        <div className="space-y-1">
          <ImageUploadArea
            imageUrls={imageUrls}
            onChange={(urls) => setImageUrls(urls)}
          />
        </div>

        {/* Root error message */}
        {errors.root && (
          <h3 className="w-full text-center text-sm text-red-500">
            {errors.root.message}
          </h3>
        )}

        {/* Save Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mx-auto px-2 py-1 rounded-lg text-white bg-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save
        </button>
      </form>
    </div>
  );
};
