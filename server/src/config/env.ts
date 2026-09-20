import "dotenv/config";

function required(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 4000),

  // MongoDB connection string. Both Better Auth (native driver) and
  // Mongoose (for EmergencyRequest/Donation models) connect to this URI.
  MONGODB_URI: required("MONGODB_URI", "mongodb://127.0.0.1:27017/roktosetu"),
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME ?? "roktosetu",

  // Better Auth
  BETTER_AUTH_SECRET: required(
    "BETTER_AUTH_SECRET",
    process.env.NODE_ENV === "production" ? undefined : "dev-only-insecure-secret-change-me"
  ),
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? `http://localhost:${process.env.PORT ?? 4000}`,

  // Comma separated list of origins allowed to call this API
  // (your deployed Next.js frontend URL goes here).
  CORS_ORIGINS: (process.env.CORS_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),

  // Days a donor must wait between donations before being auto-marked
  // available again.
  DONATION_GAP_DAYS: Number(process.env.DONATION_GAP_DAYS ?? 90),

  // Cron schedule for the availability-reset job (default: once a day at 00:05)
  AVAILABILITY_CRON_SCHEDULE: process.env.AVAILABILITY_CRON_SCHEDULE ?? "5 0 * * *",
};
