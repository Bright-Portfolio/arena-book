import { z } from "zod";
import { isPossibleNumber } from "libphonenumber-js";

const phoneSchema = z
  .object({
    countryCode: z.string().length(2).default("TH"),
    phoneNo: z
      .string()
      .regex(/^\d*$/, { message: "phone number must contain only digits" }),
  })
  .superRefine((data, ctx) => {
    ctx.addIssue({
      code: "custom",
    });
  });
