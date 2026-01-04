import { z } from "zod";

export const CreateCompanyInputschema = z.object({
  ownerId: z.number(),
  name: z.string("company name is required"),
  countryCode: z.string().min(1, "country code is required"),
  phoneNo: z.string().min(1, "phone number is required"),
  address: z.string().min(1, "address is required"),
});

export type CreateCompanyInput = z.infer<typeof CreateCompanyInputschema>;

export const CreateCompanyOutputschema = CreateCompanyInputschema.extend({
  id: z.number(),
});

export type CreateCompanyOutput = z.infer<typeof CreateCompanyOutputschema>;
