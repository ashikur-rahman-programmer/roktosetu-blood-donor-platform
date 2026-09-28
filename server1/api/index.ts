import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Application } from "express";
import { connectAll } from "../src/config/db.js";
import { createApp } from "../src/app.js";

/**
 * Vercel entry point for the whole Express app.
 *
 * IMPORTANT — read this if you're deploying here instead of Render/Railway:
 *  - This does NOT call startAvailabilityCron(). node-cron needs a
 *    persistent process to keep its timer alive; a Vercel serverless
 *    function is spun up per-request and frozen/killed between calls, so
 *    the timer would never actually fire. The daily availability reset
 *    instead runs through api/cron/availability.ts, triggered by Vercel's
 *    own Cron Jobs feature (configured in vercel.json).
 *  - `cachedApp`/`cachedDb` below are module-level variables, which Vercel
 *    reuses across "warm" invocations of the same function instance. This
 *    avoids reconnecting to MongoDB on every single request, but you will
 *    still see a fresh connection on "cold starts" — this is a normal,
 *    expected characteristic of serverless, not a bug.
 */

let cachedApp: Application | null = null;

async function getApp(): Promise<Application> {
  if (!cachedApp) {
    const db = await connectAll();
    cachedApp = createApp(db);
  }
  return cachedApp;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await getApp();
  // Express apps are valid (req, res) => void handlers, so we can just
  // hand Vercel's request/response straight to Express and let its own
  // router take over from here.
  return (app as unknown as (req: VercelRequest, res: VercelResponse) => void)(req, res);
}
