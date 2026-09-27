import { z } from "zod";

const optionalUrl = z
  .string()
  .url("Must be a valid URL")
  .optional()
  .or(z.literal(""));

export const OnboardingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .max(100, "Full name must be 100 characters or fewer")
    .optional(),
  name: z
    .string()
    .trim()
    .max(100, "Name must be 100 characters or fewer")
    .optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or fewer")
    .regex(
      /^[a-z0-9_]+$/,
      "Only lowercase letters, numbers, and underscores allowed"
    ),
  socialLinks: z
    .object({
      x: optionalUrl,
      linkedin: optionalUrl,
      instagram: optionalUrl,
    })
    .default({}),
});

export const CheckUsernameQuerySchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or fewer")
    .regex(
      /^[a-z0-9_]+$/,
      "Only lowercase letters, numbers, and underscores allowed"
    ),
});

export type OnboardingInput = z.infer<typeof OnboardingSchema>;
