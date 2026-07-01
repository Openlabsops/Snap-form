import { z } from "zod";
import { FormDefinitionSchema } from "@repo/types";

export const CreateTemplateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(2000).optional(),
  category: z.string().max(100).optional(),
  price: z.number().int().min(0).optional(),
  isPublic: z.boolean().optional(),
  iconSymbol: z.string().max(10).optional(),
  images: z
    .array(
      z
        .string()
        .url("Each image must be a valid URL")
        .startsWith("http", "Only HTTP/HTTPS URLs are allowed")
    )
    .max(5, "Maximum 5 images allowed")
    .default([]),

  // Either supply a formId to snapshot from, or provide fields directly
  formId: z.string().optional(),
  fields: FormDefinitionSchema.optional(),
}).refine((d) => Boolean(d.formId) !== Boolean(d.fields), {
  message: "Provide exactly one of `formId` or `fields`",
  path: ["fields"],
});

export type CreateTemplateInput = z.infer<typeof CreateTemplateSchema>;
