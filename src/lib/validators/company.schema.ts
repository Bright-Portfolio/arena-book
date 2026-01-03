import { z } from "zod";

export const CreateCompanyschema = z.object({
  ownerId: z.number(),
  name: z.string("company name is required"),
  country_code: z.string().default("+66"),
  adress: z.string(),
});

export type CreateCompanyInput = z.infer<typeof CreateCompanyschema>;

