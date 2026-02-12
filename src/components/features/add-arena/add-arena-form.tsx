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
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { FormField } from "@/components/ui/form-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { ArenaFormData, ArenaFormSchema } from "@/lib/validators/arena.schema";
import { PhoneInput } from "@/components/ui/phone-input";
import { ImageUploadArea } from "@/components/ui/image-upload-area";
import { SPORT_CATEGORIES } from "@/lib/constants/sports";
import { useRouter } from "next/navigation";

interface AddArenaFormProps {
  arenaId?: number;
  initialData?: ArenaFormData;
}

export const AddArenaForm = ({ arenaId, initialData }: AddArenaFormProps) => {
  const isEditMode = !!arenaId;
  const [query, setQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [showDiscard, setShowDiscard] = useState(false);
  const {
    handleSubmit,
    register,
    setError,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ArenaFormData>({
    resolver: zodResolver(ArenaFormSchema),
    mode: "onChange",
    defaultValues: initialData ?? {
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
      imageUrls: [],
    },
  });

  const sportFiltered = SPORT_CATEGORIES.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.toLocaleLowerCase().includes(query.toLowerCase()),
    ),
  }));

  const router = useRouter();

  const onSubmit = async (data: ArenaFormData) => {
    try {
      const url = isEditMode ? `/api/arenas/${arenaId}` : "/api/arenas";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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

      router.push("/manage");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("root", { message: "Network error. Please try again." });
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-4 bg-white overflow-y-auto">
      <h3 className="text-center text-lg font-semibold">
        {isEditMode ? "Edit Arena" : "Create Arena"}
      </h3>
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
        <Controller
          name="category"
          control={control}
          render={({ field, fieldState }) => (
            <Combobox
              value={field.value}
              onChange={(value) => field.onChange(value || "")}
              onClose={() => setQuery("")}
            >
              <div className="flex flex-col justify-start items-start gap-1">
                <Label>Categories</Label>
                <div className="relative w-full">
                  <div
                    className={`flex flex-row justify-between items-center px-3 py-1 w-full h-9 border rounded-md transition-shadow focus-within:ring-[1px] focus-within:ring-ring/50
                    ${fieldState.error ? "border-red-500" : "border-input"}
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
                {fieldState.error && (
                  <p className="text-sm text-red-500 leading-none">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            </Combobox>
          )}
        />

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
        <Controller
          name="imageUrls"
          control={control}
          render={({ field }) => (
            <div className="space-y-1">
              <ImageUploadArea
                imageUrls={field.value ?? []}
                onChange={(urls) => field.onChange(urls)}
                onUploadingChange={setIsUploading}
              />
            </div>
          )}
        />

        {/* Root error message */}
        {errors.root && (
          <h3 className="w-full text-center text-sm text-red-500">
            {errors.root.message}
          </h3>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          {isEditMode && (
            <button
              type="button"
              onClick={() => setShowDiscard(true)}
              className="px-2 py-1 rounded-lg border hover:bg-gray-50 cursor-pointer"
            >
              Discard
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="px-2 py-1 rounded-lg text-white bg-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </form>

      {/* Discard confirmation dialog */}
      <Dialog
        open={showDiscard}
        onClose={() => setShowDiscard(false)}
        className="relative z-50"
      >
        <DialogBackdrop className="fixed inset-0 bg-black/30" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
            <DialogTitle className="text-lg font-semibold">
              Discard Changes
            </DialogTitle>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to discard all changes?
            </p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDiscard(false)}
                className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50 cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setShowDiscard(false);
                }}
                className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 cursor-pointer"
              >
                Discard
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
};
