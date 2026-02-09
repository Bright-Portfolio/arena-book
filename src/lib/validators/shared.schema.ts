import { z } from "zod";
import { type CountryCode, isPossibleNumber } from "libphonenumber-js";

// Base schema
export const phoneFieldSchema = z.object({
  phoneCountryISO2: z.string().length(2),
  phoneNo: z
    .string()
    .min(1, { message: "phone number is required" })
    .regex(/^\d*$/, { message: "phone number must contain only digits" }),
});

// Resusable refinement function
export const phoneRefinement = (
  data: {
    phoneCountryISO2: string;
    phoneNo: string;
  },
  ctx: z.RefinementCtx,
) => {
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
};
