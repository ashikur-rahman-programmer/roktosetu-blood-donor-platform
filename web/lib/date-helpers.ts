const DONATION_GAP_DAYS = Number(process.env.NEXT_PUBLIC_DONATION_GAP_DAYS ?? 90);

export function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  return Math.floor((now - then) / (1000 * 60 * 60 * 24));
}

export function daysAgoLabel(dateStr: string | null): string {
  const days = daysSince(dateStr);
  if (days === null) return "কখনো রক্ত দেননি";
  if (days === 0) return "আজই দিয়েছেন";
  if (days === 1) return "১ দিন আগে";
  return `${days} দিন আগে`;
}

export function isEligible(dateStr: string | null): boolean {
  const days = daysSince(dateStr);
  if (days === null) return true;
  return days >= DONATION_GAP_DAYS;
}

export function daysUntilEligible(dateStr: string | null): number {
  const days = daysSince(dateStr);
  if (days === null) return 0;
  return Math.max(0, DONATION_GAP_DAYS - days);
}

export function todayISO(): string {
  return new Date().toISOString();
}
