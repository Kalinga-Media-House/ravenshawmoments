// =============================================================================
// Ravenshaw Moments
// File      : src/features/donation/schemas/donation.ts
// Purpose   : Donation form validation schemas
// =============================================================================

import { z } from "zod";
import { DONATION_LIMITS, MAX_MESSAGE_LENGTH } from "../config/donation";

export const donationFormSchema = z.object({
  amount: z
    .number()
    .min(
      DONATION_LIMITS.min,
      `Minimum contribution is \u20B9${DONATION_LIMITS.min}`
    )
    .max(
      DONATION_LIMITS.max,
      `Maximum contribution is \u20B9${new Intl.NumberFormat("en-IN").format(DONATION_LIMITS.max)}`
    )
    .refine(
      (val) => Number.isFinite(val) && val > 0,
      "Please enter a valid positive amount."
    ),

  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required.")
    .max(200, "Full name is too long."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address.")
    .max(254, "Email address is too long."),

  phone: z
    .string()
    .trim()
    .min(10, "Please enter a valid phone number.")
    .max(15, "Phone number is too long.")
    .regex(
      /^[+]?[0-9\s-]{10,15}$/,
      "Please enter a valid phone number."
    ),

  isPublic: z.boolean().default(false),

  purpose: z.string().trim().default("General Platform Support"),
});

export type DonationFormData = z.infer<typeof donationFormSchema>;
