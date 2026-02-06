"use client";

import { useEffect, useState } from "react";
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
import {
  Map,
  MapTileLayer,
  MapMarker,
  MapZoomControl,
  MapLocateControl,
} from "@/components/ui/map";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePlaceSearch } from "@/components/ui/place-autocomplete";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { FormField } from "@/components/ui/form-field";
import { TextareaField } from "@/components/ui/textarea-field";
import { ArenaFormSchema } from "@/lib/validators/arena.schema";
import { useMap } from "react-leaflet";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  CldImage,
  CldUploadWidget,
  CloudinaryUploadWidgetResults,
} from "next-cloudinary";
import type { LatLngExpression } from "leaflet";

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
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const {
    handleSubmit,
    register,
    setError,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ArenaFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      openTime: "09:00",
      closeTime: "18:00",
      category: "",
      address: "",
      latitude: 0,
      longitude: 0,
      phoneCountryISO2: "TH",
      phoneNo: "",
    },
  });

  const address = watch("address");

  const sportFiltered = SPORT_CATEGORIES.map((group) => ({
    ...group,
    items: group.items.filter((item) =>
      item.toLocaleLowerCase().includes(query.toLowerCase()),
    ),
  }));

  const formatedAdress = (address ?? "").trim().replace(/\s+/g, "");

  // Auto search from address field
  const { results, error } = usePlaceSearch({
    query: formatedAdress ?? "",
    debounceMs: 800,
    limit: 1,
  });

  //
  useEffect(() => {
    if (results.length > 0) {
      const [lng, lat] = results[0].geometry.coordinates;
      setPosition([lat, lng]);
      setValue("latitude", lat);
      setValue("longitude", lng);
    }
  }, [results, setValue]);

  // reset map when address field was clear
  useEffect(() => {
    if (address === "") {
      setPosition(null);
    }
  }, [address]);

  // Fly to the location when the address field have value
  function MapFlyTo({ position }: { position: LatLngExpression | null }) {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.flyTo(position, 16);
      } else {
        map.flyTo([0, 0], 0);
      }
    }, [map, position]);

    return null;
  }

  const handlePhoneChange = () => {};

  return (
    <div className="w-full p-4 bg-white">
      <h3 className="text-center text-lg font-semibold">Create Arena Form</h3>
      <form
        // onSubmit={}
        className="flex flex-col justify-center items-stretch w-full space-y-4"
      >
        <FormField label="Name" />
        <FormField label="Description" />
        <FormField label="Price" type="number" />
        {/* Time picker */}
        <div className="flex flex-row justify-between items-center gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <Label>Open-time</Label>
            <Input type="time" defaultValue="09:00" className="" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
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
          <div className="flex flex-col justify-start items-start gap-1">
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
          </div>
        </Combobox>

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

        {/* Map */}
        <div className="w-full h-64 border border-gray-200 rounded-md overflow-hidden">
          <Map
            center={position ?? [0, 0]}
            zoom={position ? 14 : 0}
            className="!min-h-0"
          >
            <MapTileLayer />
            <MapZoomControl />
            <MapFlyTo position={position} />
            <MapLocateControl />
            {position && (
              <MapMarker
                position={position}
                draggable
                eventHandlers={{
                  dragend: (e) => {
                    const marker = e.target;
                    const newPos = marker.getLatLng();
                    setPosition([newPos.lat, newPos.lng]);
                  },
                }}
              />
            )}
          </Map>
          {error && (
            <span className="pt-2 text-sm text-red-500">{error.message}</span>
          )}
        </div>

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
                  label="arena phone number"
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

        {/* Upload images */}
        <div>
          <Label>Arena Images</Label>
          {imageUrls.length > 0 && (
            // Preview images
            <div>
              {imageUrls.map((url, index) => (
                <div key={index}>
                  <CldImage
                    alt={`arena ${index + 1}`}
                    src={url}
                    width={200}
                    height={200}
                    crop="fill"
                    gravity="auto"
                    className="w-full h-full object-ceover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImageUrls((prev) => prev.filter((_, i) => i !== index))
                    }
                    className=""
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          {/* <CldUploadWidget
            uploadPreset="YOUR_PRESET_NAME"
            onSuccess={(result) => {
              const info = result.info as { secure_ur: string };
              setImageUrls((prev) => [...prev, info.secure_url]);
            }}
          >
            {({ open }) => {
              <button
                type="button"
                onClick={() => open()}
                className="w-full h-32 border-2 border-dashed border-gray-300"
              >
                + Add Image
              </button>;
            }}
          </CldUploadWidget> */}
        </div>

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
