import type { VercelRequest, VercelResponse } from "@vercel/node";
import { connectAll } from "../../src/config/db.js";
import { runAvailabilityReset } from "../../src/jobs/availability.cron.js";
import { env } from "../../src/config/env.js";

let connected = false;

/**
 * Triggered by Vercel's own Cron Jobs feature (see the "crons" entry in
 * vercel.json), NOT by node-cron — see api/index.ts for why. Vercel signs
 * its own cron requests with `Authorization: Bearer $CRON_SECRET`
 * automatically when CRON_SECRET is set as an env var on the project, so
 * we check that header to stop random people from hitting this endpoint
 * and forcing reset runs.
 *
 * Note: Vercel's Hobby (free) plan only allows daily cron schedules and
 * runs at an imprecise time within the hour you configure. That's fine
 * for this job.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (env.CRON_SECRET) {
    const auth = req.headers.authorization;
    if (auth !== `Bearer ${env.CRON_SECRET}`) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }
  }

  try {
    if (!connected) {
      await connectAll();
      connected = true;
    }
    const result = await runAvailabilityReset();
    res.status(200).json({ ok: true, ...result });
  } catch (err) {
    console.error("[cron:vercel] availability reset failed", err);
    res.status(500).json({ ok: false, error: "reset failed" });
  }
}
