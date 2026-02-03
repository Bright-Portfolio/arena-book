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
  } = useForm<CompanyFormData>({
    resolver: zodResolver(CompanyFormSchema),
    defaultValues: {
      name: "",
      countryCode: "+66",
      phoneNo: "",
      address: "",
    },
  });
  const { data: session, update } = useSession();

  const onSubmit = async (data: CompanyFormData) => {
    const userId = session?.user.id;

    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/company/${userId}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(data),
        },
      );
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
        <label htmlFor="company-name-input" className="text-xs text-black">
          company name
        </label>
        <input
          id="company-name-input"
          type="text"
          placeholder="Enter your company name"
          {...register("name")}
          className="px-2 py-1 w-full border border-gray-300 rounded-lg outline-none focus:border-black"
        />
      </div>

      <Controller
        name="countryCode"
        control={control}
        render={({ field: countryField }) => (
          <Controller
            name="phoneNo"
            control={control}
            render={({ field: phoneField }) => (
              <PhoneInput
                label="company phone number"
                value={{
                  countryCode: countryField.value,
                  phoneNo: phoneField.value,
                }}
                onChange={(newValue) => {
                  countryField.onChange(newValue.countryCode);
                  phoneField.onChange(newValue.phoneNo);
                }}
              />
            )}
          />
        )}
      />

      <div className="w-full">
        <label htmlFor="address-input" className="text-xs text-black">
          address
        </label>
        <textarea
          id="address-input"
          placeholder="Enter your company address"
          {...register("address")}
          className="px-2 py-1 w-full border border-gray-300 rounded-lg  focus:border-black resize-none outline-none"
        />
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
