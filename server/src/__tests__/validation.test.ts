import { describe, it, expect } from "vitest";
import { signUpSchema, updateProfileSchema, donorSearchQuerySchema } from "../modules/user/user.validation";
import {
  createEmergencyRequestSchema,
  listEmergencyQuerySchema,
} from "../modules/emergency/emergency.validation";

describe("user.validation", () => {
  const validSignUp = {
    name: "Ashikur Rahman",
    email: "ashik@example.com",
    password: "secret1",
    phone: "01712345678",
    bloodGroup: "B+",
    division: "রাজশাহী",
    district: "পাবনা",
    upazila: "পাবনা সদর",
  };

  it("accepts a valid sign-up payload", () => {
    expect(signUpSchema.safeParse(validSignUp).success).toBe(true);
  });

  it("rejects an invalid Bangladeshi phone number", () => {
    const result = signUpSchema.safeParse({ ...validSignUp, phone: "12345" });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown blood group", () => {
    const result = signUpSchema.safeParse({ ...validSignUp, bloodGroup: "Z+" });
    expect(result.success).toBe(false);
  });

  it("updateProfileSchema allows a partial patch", () => {
    expect(updateProfileSchema.safeParse({ isAvailable: false }).success).toBe(true);
    expect(updateProfileSchema.safeParse({}).success).toBe(true);
  });

  it("donorSearchQuerySchema defaults page/limit and coerces onlyAvailable", () => {
    const result = donorSearchQuerySchema.parse({ onlyAvailable: "false" });
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.onlyAvailable).toBe(false);
  });
});

describe("emergency.validation", () => {
  const validRequest = {
    patientName: "আব্দুল করিম",
    bloodGroup: "O+",
    unitsNeeded: "2",
    division: "ঢাকা",
    district: "ঢাকা",
    hospital: "ঢাকা মেডিকেল",
    contactPhone: "01812345678",
    urgency: "high",
  };

  it("accepts a valid emergency request and coerces unitsNeeded to a number", () => {
    const result = createEmergencyRequestSchema.parse(validRequest);
    expect(result.unitsNeeded).toBe(2);
    expect(typeof result.unitsNeeded).toBe("number");
  });

  it("rejects zero or negative units needed", () => {
    const result = createEmergencyRequestSchema.safeParse({
      ...validRequest,
      unitsNeeded: "0",
    });
    expect(result.success).toBe(false);
  });

  it("defaults urgency to 'high' when omitted", () => {
    const { urgency, ...rest } = validRequest;
    const result = createEmergencyRequestSchema.parse(rest);
    expect(result.urgency).toBe("high");
  });

  it("listEmergencyQuerySchema defaults page/limit", () => {
    const result = listEmergencyQuerySchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });
});
