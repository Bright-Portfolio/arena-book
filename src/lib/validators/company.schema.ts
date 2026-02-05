import { z } from "zod";
import { phoneFieldSchema, phoneRefinement } from "./shared.schema";

export const CompanyBaseSchema = phoneFieldSchema.extend({
  name: z.string().min(1, "company name is required"),
  address: z.string().min(1, "address is required"),
});

export const CompanyFormSchema = CompanyBaseSchema.superRefine(phoneRefinement);
export type CompanyFormData = z.infer<typeof CompanyFormSchema>;

export const CreateCompanyInputSchema = CompanyBaseSchema.extend({
  ownerId: z.number(),
});
export type CreateCompanyInput = z.infer<typeof CreateCompanyInputSchema>;

export const CreateCompanyOutputSchema = CreateCompanyInputSchema.extend({
  id: z.number(),
});

export type CreateCompanyOutput = z.infer<typeof CreateCompanyOutputSchema>;
