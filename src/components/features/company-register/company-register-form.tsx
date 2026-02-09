"use client";

import { FC } from "react";
import { useForm, Controller } from "react-hook-form";
import { PhoneInput } from "../../ui/phone-input";
import {
  CompanyFormSchema,
  CompanyFormData,
} from "@/lib/validators/company.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";

interface CompanyRegisterFormProps {
  onSuccess: () => void;
}

export const CompanyRegisterForm: FC<CompanyRegisterFormProps> = ({
  onSuccess,
}) => {
  const {
    handleSubmit,
    register,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(CompanyFormSchema),
    defaultValues: {
      name: "",
      phoneCountryISO2: "TH",
      phoneNo: "",
      address: "",
    },
  });
  const { data: session, update } = useSession();

  const onSubmit = async (data: CompanyFormData) => {
    if (!session?.user.id) {
      console.error("User not authenticated");
      return;
    }

    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const result = await response.json();
        setError("root", { message: result.error || "Something went wrong" });
        return;
      }

      await update({});
      onSuccess();
    } catch (error) {
      console.error("error:", error);
      setError("root", { message: "Network error. Please try again." });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center items-start gap-3 w-full"
    >
      {errors.root && (
        <h3 className="w-full text-center text-sm text-red-500">
          {errors.root.message}
        </h3>
      )}
      <div className="w-full">
        <label htmlFor="company-name-input" className="text-sm text-black">
          company name
        </label>
        <input
          id="company-name-input"
          type="text"
          placeholder="Enter your company name"
          {...register("name")}
          className={`px-2 py-1 w-full border rounded-lg outline-none focus:border-black ${errors.name ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.name && (
          <p className="text-sm text-red-500 leading-none">
            {errors.name.message}
          </p>
        )}
      </div>

      <Controller
        name="phoneCountryISO2"
        control={control}
        render={({ field: countryField }) => (
          <Controller
            name="phoneNo"
            control={control}
            render={({ field: phoneField }) => (
              <PhoneInput
                label="company phone number"
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

      <div className="flex flex-col w-full">
        <label htmlFor="address-input" className="text-sm text-black">
          address
        </label>
        <textarea
          id="address-input"
          placeholder="Enter your company address"
          {...register("address")}
          className={`px-2 py-1 w-full border rounded-lg focus:border-black resize-none outline-none ${errors.address ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.address && (
          <p className="text-sm text-red-500 leading-none">
            {errors.address.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`mx-auto px-2 py-1 rounded-lg text-white bg-black cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Register
      </button>
    </form>
  );
};
