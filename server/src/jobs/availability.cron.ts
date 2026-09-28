import cron from "node-cron";
import type { Db } from "mongodb";
import { getNativeDb } from "../config/db.js";
import { env } from "../config/env.js";

/**
 * Flips every donor whose DONATION_GAP_DAYS has elapsed back to
 * isAvailable = true. Shared by:
 *  - startAvailabilityCron() below (long-running hosts like Render/Railway)
 *  - api/cron/availability-reset.ts (Vercel Cron, since serverless
 *    functions can't keep a node-cron timer alive between requests)
 */
export async function runAvailabilityReset(db: Db = getNativeDb()) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - env.DONATION_GAP_DAYS);

  const result = await db.collection("user").updateMany(
    { isAvailable: false, lastDonationDate: { $lte: cutoff } },
    { $set: { isAvailable: true } }
  );

  return { modifiedCount: result.modifiedCount };
}

export function startAvailabilityCron() {
  cron.schedule(env.AVAILABILITY_CRON_SCHEDULE, async () => {
    try {
      const { modifiedCount } = await runAvailabilityReset();
      console.log(`[cron] availability reset: ${modifiedCount} donor(s) marked available again`);
    } catch (err) {
      console.error("[cron] availability reset failed", err);
    }
  });

  console.log(
    `[cron] availability reset scheduled ("${env.AVAILABILITY_CRON_SCHEDULE}", gap=${env.DONATION_GAP_DAYS}d)`
  );
}
