import { env } from "../config/env";

export function daysSince(date: Date | string | null | undefined): number | null {
  if (!date) return null;
  const then = new Date(date).getTime();
  return Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24));
}

export function isEligible(date: Date | string | null | undefined): boolean {
  const days = daysSince(date);
  if (days === null) return true;
  return days >= env.DONATION_GAP_DAYS;
}
