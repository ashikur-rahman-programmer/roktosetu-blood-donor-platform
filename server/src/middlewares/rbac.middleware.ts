import type { Request, Response, NextFunction } from "express";

export function requireRole(...roles: Array<"user" | "admin">) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "লগইন প্রয়োজন" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "এই কাজের জন্য অনুমতি নেই" });
    }
    next();
  };
}
