import { describe, it, expect, vi, afterEach } from "vitest";
import { daysSince, isEligible } from "../utils/dateHelper";

describe("dateHelper", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("daysSince returns null for no date", () => {
    expect(daysSince(null)).toBeNull();
    expect(daysSince(undefined)).toBeNull();
  });

  it("daysSince computes whole days elapsed", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-10T00:00:00Z"));
    expect(daysSince(new Date("2026-01-01T00:00:00Z"))).toBe(9);
  });

  it("isEligible is true for a donor who has never donated", () => {
    expect(isEligible(null)).toBe(true);
  });

  it("isEligible is false just before the gap elapses", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
    const lastDonation = new Date("2025-11-15T00:00:00Z"); // 47 days before
    expect(isEligible(lastDonation)).toBe(false);
  });

  it("isEligible is true once the gap (90 days) has elapsed", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-01T00:00:00Z"));
    const lastDonation = new Date("2026-01-01T00:00:00Z"); // 90 days before
    expect(isEligible(lastDonation)).toBe(true);
  });
});
