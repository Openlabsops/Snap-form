import { z } from "zod";
import { FormDefinitionSchema, FormResponseDataSchema } from "@repo/types";


const FormTypeSchema = z
  .string()
  .trim()
  .transform((value: string) => value.toUpperCase())
  .pipe(z.enum(["SCROLL", "STEP", "CHAT"]));

export const CreateFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  coverUrl: z.string().url().optional(),
  iconSymbol: z.string().optional(),
  requireEmail: z.boolean().default(true),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "Slug may only contain lowercase letters, numbers, and hyphens")
    .min(3)
    .max(100)
    .optional(),
  type: FormTypeSchema.default("SCROLL"),
  definition: FormDefinitionSchema.default({ version: "1.0", elements: [] }),
});

export type CreateFormInput = z.infer<typeof CreateFormSchema>;



export const UpdateFormSchema = CreateFormSchema.partial();

export type UpdateFormInput = z.infer<typeof UpdateFormSchema>;



export const SubmitResponseSchema = z.object({
  email: z.string().email().optional(),
  data: FormResponseDataSchema,
});

export const GenerateFormSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt cannot be empty").max(1000, "Prompt is too long").optional()
});


export type SubmitResponseInput = z.infer<typeof SubmitResponseSchema>;
