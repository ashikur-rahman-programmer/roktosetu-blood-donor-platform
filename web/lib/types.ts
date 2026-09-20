export type BloodGroup =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type Division =
  | "ঢাকা"
  | "চট্টগ্রাম"
  | "রাজশাহী"
  | "খুলনা"
  | "বরিশাল"
  | "সিলেট"
  | "রংপুর"
  | "ময়মনসিংহ";

export interface Donor {
  id: string;
  name: string;
  bloodGroup: BloodGroup;
  division: Division;
  district: string;
  upazila: string;
  phone?: string; // shown to logged-in searchers directly — see /api/users/search
  lastDonationDate: string | null; // ISO date, null = never donated
  isAvailable: boolean;
  donationCount: number;
  verified: boolean;
}

export interface EmergencyRequest {
  _id: string;
  postedByUserId: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  division: Division;
  district: string;
  hospital: string;
  contactPhone: string;
  note: string;
  urgency: "high" | "medium" | "low";
  createdAt: string; // ISO datetime
  status: "open" | "fulfilled";
}
