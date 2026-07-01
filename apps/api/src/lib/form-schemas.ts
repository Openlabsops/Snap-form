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
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Slug must start and end with a letter or number, hyphens allowed between words")
    .min(3)
    .max(100)
    .optional(),
  type: FormTypeSchema.default("SCROLL"),
  definition: FormDefinitionSchema.default({ version: "1.0", elements: [] }),
});

export const UpdateFormSchema = CreateFormSchema.partial();

export const GoogleSheetsIntegrationSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().optional(),
  spreadsheetId: z.string().min(1),
  spreadsheetUrl: z.string().url(),
});

export const SubmitResponseSchema = z.object({
  email: z.string().email().optional(),
  data: FormResponseDataSchema,
});

export const GenerateFormSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt cannot be empty").max(1000, "Prompt is too long").optional()
});


export type CreateFormInput = z.infer<typeof CreateFormSchema>;
export type UpdateFormInput = z.infer<typeof UpdateFormSchema>;
export type GoogleSheetsIntegrationInput = z.infer<typeof GoogleSheetsIntegrationSchema>;
export type SubmitResponseInput = z.infer<typeof SubmitResponseSchema>;
export type GenerateFormInput = z.infer<typeof GenerateFormSchema>;