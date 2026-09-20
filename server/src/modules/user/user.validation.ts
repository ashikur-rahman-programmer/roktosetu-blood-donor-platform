import { z } from "zod";

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

export const signUpSchema = z.object({
  name: z.string().min(2, "নাম অন্তত ২ অক্ষরের হতে হবে"),
  email: z.string().email("সঠিক ইমেইল দিন"),
  password: z.string().min(6, "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে"),
  phone: z.string().regex(/^01[3-9][0-9]{8}$/, "সঠিক বাংলাদেশি ফোন নম্বর দিন"),
  bloodGroup: z.enum(BLOOD_GROUPS),
  division: z.string().min(1),
  district: z.string().min(1),
  upazila: z.string().min(1),
  lastDonationDate: z.string().datetime().optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z.string().regex(/^01[3-9][0-9]{8}$/).optional(),
  division: z.string().min(1).optional(),
  district: z.string().min(1).optional(),
  upazila: z.string().min(1).optional(),
  isAvailable: z.boolean().optional(),
});

export const donorSearchQuerySchema = z.object({
  bloodGroup: z.enum(BLOOD_GROUPS).optional(),
  division: z.string().optional(),
  district: z.string().optional(),
  onlyAvailable: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => v !== "false"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
