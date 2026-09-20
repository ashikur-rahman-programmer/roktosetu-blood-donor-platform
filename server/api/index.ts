import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { Application } from "express";
import { connectAll } from "../src/config/db";
import { createApp } from "../src/app";

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
  return (app as unknown as (req: VercelRequest, res: VercelResponse) => void)(
    req,
    res,
  );
}
