import { z } from "zod";
import { type CountryCode, isPossibleNumber } from "libphonenumber-js";

export const phoneSchema = z
  .object({
    phoneCountryISO2: z.string().length(2).default("TH"),
    phoneNo: z
      .string()
      .regex(/^\d*$/, { message: "phone number must contain only digits" }),
  })
  .superRefine((data, ctx) => {
    if (data.phoneCountryISO2 && data.phoneNo) {
      const isValid = isPossibleNumber(
        data.phoneNo,
        data.phoneCountryISO2 as CountryCode,
      );
      if (!isValid) {
        ctx.addIssue({
          code: "custom",
          message: "Invalid phone number length",
          path: ["phoneNo"],
        });
      }
    }
  });
