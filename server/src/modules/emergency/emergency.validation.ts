import { z } from "zod";
import { BLOOD_GROUPS } from "../user/user.validation";

export const createEmergencyRequestSchema = z.object({
  patientName: z.string().min(2, "রোগীর নাম দিন"),
  bloodGroup: z.enum(BLOOD_GROUPS),
  unitsNeeded: z.coerce.number().int().min(1, "কমপক্ষে ১ ইউনিট দিন"),
  division: z.string().min(1, "বিভাগ নির্বাচন করুন"),
  district: z.string().min(1, "জেলা নির্বাচন করুন"),
  hospital: z.string().min(2, "হাসপাতালের নাম দিন"),
  contactPhone: z.string().regex(/^01[3-9][0-9]{8}$/, "সঠিক ফোন নম্বর দিন"),
  note: z.string().max(300).optional(),
  urgency: z.enum(["high", "medium", "low"]).default("high"),
});

export const listEmergencyQuerySchema = z.object({
  status: z.enum(["open", "fulfilled"]).optional(),
  division: z.string().optional(),
  bloodGroup: z.enum(BLOOD_GROUPS).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
