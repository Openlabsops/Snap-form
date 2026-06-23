import { z } from "zod";


const BaseElementSchema = z.object({
  id: z.string().uuid(),
  label: z.string().min(1, "Label cannot be empty"),
  description: z.string().optional(),
  required: z.boolean().default(false),
});

/** Single-line free text */
const TextInputElementSchema = BaseElementSchema.extend({
  type: z.literal("textInput"),
  placeholder: z.string().optional(),
  maxLength: z.number().int().positive().optional(),
});

/** Multi-line free text */
const TextareaElementSchema = BaseElementSchema.extend({
  type: z.literal("textarea"),
  placeholder: z.string().optional(),
  rows: z.number().int().min(2).max(20).default(4),
  maxLength: z.number().int().positive().optional(),
});

/** Numeric star/point rating */
const RatingElementSchema = BaseElementSchema.extend({
  type: z.literal("rating"),
  /** Maximum rating value — renders this many stars/points */
  max: z.number().int().min(2).max(10).default(5),
});

/** Pick exactly one option from a list */
const MultipleChoiceElementSchema = BaseElementSchema.extend({
  type: z.literal("multipleChoice"),
  options: z
    .array(
      z.object({
        id: z.string().uuid(),
        label: z.string().min(1),
      }),
    )
    .min(2, "Multiple choice needs at least 2 options"),
});

/** Pick one or more options from a list */
const CheckboxElementSchema = BaseElementSchema.extend({
  type: z.literal("checkbox"),
  options: z
    .array(
      z.object({
        id: z.string().uuid(),
        label: z.string().min(1),
      }),
    )
    .min(1, "Checkbox group needs at least 1 option"),
});

/** Pick one option from a collapsed dropdown menu */
const DropdownElementSchema = BaseElementSchema.extend({
  type: z.literal("dropdown"),
  placeholder: z.string().optional(),
  options: z
    .array(
      z.object({
        id: z.string().uuid(),
        label: z.string().min(1),
      }),
    )
    .min(2, "Dropdown needs at least 2 options"),
});

/** Email address input with built-in format validation */
const EmailElementSchema = BaseElementSchema.extend({
  type: z.literal("email"),
  placeholder: z.string().optional(),
});

/** Phone number input */
const PhoneElementSchema = BaseElementSchema.extend({
  type: z.literal("phone"),
  placeholder: z.string().optional(),
});

/** Date picker */
const DatePickerElementSchema = BaseElementSchema.extend({
  type: z.literal("datePicker"),
  /** ISO date string e.g. "2024-01-01" */
  minDate: z.string().date().optional(),
  maxDate: z.string().date().optional(),
});

/** Non-interactive heading / section divider */
const HeadingElementSchema = BaseElementSchema.extend({
  type: z.literal("heading"),
  /** h1 | h2 | h3 */
  level: z.enum(["h1", "h2", "h3"]).default("h2"),
  // label acts as the heading text; description is optional sub-text
}).omit({ required: true });

/** Non-interactive paragraph of text */
const ParagraphElementSchema = BaseElementSchema.extend({
  type: z.literal("paragraph"),
  // label acts as the paragraph text
}).omit({ required: true });

// ============================================
// DISCRIMINATED UNION — the full element type
// ============================================
// Zod checks the "type" field first to know which schema to validate against.
// This is more efficient and gives better error messages than z.union().

export const FormElementSchema = z.discriminatedUnion("type", [
  TextInputElementSchema,
  TextareaElementSchema,
  RatingElementSchema,
  MultipleChoiceElementSchema,
  CheckboxElementSchema,
  DropdownElementSchema,
  EmailElementSchema,
  PhoneElementSchema,
  DatePickerElementSchema,
  HeadingElementSchema,
  ParagraphElementSchema,
]);

// ============================================
// TOP-LEVEL FORM DEFINITION
// ============================================

export const FormDefinitionSchema = z.object({
  /**
   * Schema version — bump this when the structure changes in a breaking way.
   * Lets you migrate old saved forms without data loss.
   */
  version: z.literal("1.0").default("1.0"),
  elements: z.array(FormElementSchema),
});

// ============================================
// INFERRED TYPESCRIPT TYPES
// ============================================
// z.infer<> generates TypeScript types directly from Zod schemas —
// no need to maintain parallel type definitions manually.

export type FormElement = z.infer<typeof FormElementSchema>;
export type FormDefinition = z.infer<typeof FormDefinitionSchema>;

// Individual element types (useful for component props)
export type TextInputElement = z.infer<typeof TextInputElementSchema>;
export type TextareaElement = z.infer<typeof TextareaElementSchema>;
export type RatingElement = z.infer<typeof RatingElementSchema>;
export type MultipleChoiceElement = z.infer<typeof MultipleChoiceElementSchema>;
export type CheckboxElement = z.infer<typeof CheckboxElementSchema>;
export type DropdownElement = z.infer<typeof DropdownElementSchema>;
export type EmailElement = z.infer<typeof EmailElementSchema>;
export type PhoneElement = z.infer<typeof PhoneElementSchema>;
export type DatePickerElement = z.infer<typeof DatePickerElementSchema>;
export type HeadingElement = z.infer<typeof HeadingElementSchema>;
export type ParagraphElement = z.infer<typeof ParagraphElementSchema>;

// Convenience: the literal union of all valid "type" strings
export type FormElementType = FormElement["type"];

// ============================================
// RESPONSE DATA SCHEMA
// ============================================
// Validates the `data` field on a Response row:
// { [elementId: uuid]: submitted value }

export const FormResponseDataSchema = z.record(
  z.string().uuid(), // key   = element id
  z.union([
    z.string(),   // textInput, textarea, email, phone, dropdown, datePicker
    z.number(),   // rating
    z.boolean(),  // single checkbox
    z.array(z.string()), // checkbox group (array of option ids)
    z.null(),     // explicitly cleared
  ]),
);

export type FormResponseData = z.infer<typeof FormResponseDataSchema>;
