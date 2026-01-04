import { z } from "zod";

export const CreateCompanyschema = z.object({
  ownerId: z.number(),
  name: z.string("company name is required"),
  country_code: z.string().default("+66"),
  phoneNo: z.string().min(2, "phone number is required"),
  adress: z.string().min(2, "address is required"),
});

export type CreateCompanyInput = z.infer<typeof CreateCompanyschema>;
