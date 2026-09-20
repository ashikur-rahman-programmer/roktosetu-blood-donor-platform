import cron from "node-cron";
import { getNativeDb } from "../config/db";
import { env } from "../config/env";

/**
 * Runs once a day. Any donor who is currently marked unavailable
 * (because they donated recently) and whose DONATION_GAP_DAYS has now
 * elapsed gets flipped back to isAvailable = true automatically — no
 * manual action needed from the donor.
 */
export function startAvailabilityCron() {
  cron.schedule(env.AVAILABILITY_CRON_SCHEDULE, async () => {
    try {
      const db = getNativeDb();
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - env.DONATION_GAP_DAYS);

      const result = await db.collection("user").updateMany(
        {
          isAvailable: false,
          lastDonationDate: { $lte: cutoff },
        },
        { $set: { isAvailable: true } }
      );

      console.log(
        `[cron] availability reset: ${result.modifiedCount} donor(s) marked available again`
      );
    } catch (err) {
      console.error("[cron] availability reset failed", err);
    }
  });

  console.log(
    `[cron] availability reset scheduled ("${env.AVAILABILITY_CRON_SCHEDULE}", gap=${env.DONATION_GAP_DAYS}d)`
  );
}
