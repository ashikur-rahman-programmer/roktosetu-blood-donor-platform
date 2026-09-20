import dns from "node:dns/promises";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import type { Db } from "mongodb";
import { env } from "./config/env";
import { createAuth, type Auth } from "./modules/auth/auth.config";
import { authRouter } from "./modules/auth/auth.routes";
import { userRouter } from "./modules/user/user.routes";
import { emergencyRouter } from "./modules/emergency/emergency.routes";
import { adminRouter } from "./modules/admin/admin.routes";
import { attachSession } from "./middlewares/auth.middleware";
import { apiLimiter } from "./middlewares/rateLimit.middleware";
import { notFoundHandler, errorHandler } from "./middlewares/error.middleware";

export function createApp(db: Db) {
  const auth: Auth = createAuth(db);
  const app = express();

  app.set("trust proxy", 1); // needed behind Render/Railway/Vercel proxies

  app.use(
    cors({
      origin: env.CORS_ORIGINS,
      credentials: true,
    })
  );
  app.use(helmet());
  app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

  app.get("/health", (_req, res) => res.json({ ok: true, env: env.NODE_ENV }));

  // Better Auth needs to read the raw request body itself, so its router is
  // mounted BEFORE express.json() and does not go through the JSON parser.
  app.use("/api/auth", authRouter(auth));

  // Everything after this point can safely assume a parsed JSON body and a
  // resolved req.user (if a session cookie was present).
  app.use(express.json());
  app.use(apiLimiter);
  app.use(attachSession(auth));

  app.use("/api/users", userRouter);
  app.use("/api/emergency", emergencyRouter);
  app.use("/api/admin", adminRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
