import { Router } from "express";
import { toNodeHandler } from "better-auth/node";
import type { Auth } from "./auth.config";

/**
 * Mounts Better Auth's handler, which serves all of:
 *   POST /api/auth/sign-up/email
 *   POST /api/auth/sign-in/email
 *   POST /api/auth/sign-out
 *   GET  /api/auth/get-session
 *   ...and more.
 *
 * IMPORTANT: this must be mounted BEFORE express.json() runs on this path,
 * because Better Auth parses the raw request body itself. See app.ts.
 */
export function authRouter(auth: Auth): Router {
  const router = Router();
  router.all("/*splat", toNodeHandler(auth));
  return router;
}
