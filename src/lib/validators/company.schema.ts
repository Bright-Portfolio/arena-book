import { z } from "zod";

export const CompanyFormSchema = z.object({
  name: z.string().min(1, "company name is required"),
  countryCode: z.string().min(1, "country code is required"),
  phoneNo: z.string().min(1, "phone number is required"),
  address: z.string().min(1, "address is required"),
});

export type CompanyFormData = z.infer<typeof CompanyFormSchema>;

export const CreateCompanyInputSchema = CompanyFormSchema.extend({
  ownerId: z.number(),
});

export type CreateCompanyInput = z.infer<typeof CreateCompanyInputSchema>;

export const CreateCompanyOutputSchema = CreateCompanyInputSchema.extend({
  id: z.number(),
});

export type CreateCompanyOutput = z.infer<typeof CreateCompanyOutputSchema>;
