import type { Request, Response, NextFunction } from "express";
import { fromNodeHeaders } from "better-auth/node";
import type { Auth } from "../modules/auth/auth.config";

// Minimal shape we rely on elsewhere in the app.
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  bloodGroup: string;
  division: string;
  district: string;
  upazila: string;
  lastDonationDate: string | null;
  isAvailable: boolean;
  donationCount: number;
  verified: boolean;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: SessionUser;
    }
  }
}

/**
 * Reads the Better Auth session cookie (if present) and attaches the user
 * to `req.user`. Does NOT block the request if there's no session — use
 * `requireAuth` after this for routes that must be authenticated.
 */
export function attachSession(auth: Auth) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      if (session?.user) {
        req.user = session.user as unknown as SessionUser;
      }
    } catch {
      // no valid session — leave req.user undefined
    }
    next();
  };
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: "লগইন প্রয়োজন" });
  }
  next();
}
