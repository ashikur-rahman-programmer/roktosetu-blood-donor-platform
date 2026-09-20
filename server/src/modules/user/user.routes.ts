import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { writeLimiter } from "../../middlewares/rateLimit.middleware";
import {
  getMe,
  patchMe,
  postDonateToday,
  patchAvailability,
  getMyHistory,
  getDonorSearch,
} from "./user.controller";

export const userRouter = Router();

// Search requires login: results include the donor's phone number
// directly (no approval flow), so requiring an account at least gives us
// an accountable identity behind every number view — not anonymous scraping.
userRouter.get("/search", requireAuth, getDonorSearch);

// Authenticated: manage your own profile.
userRouter.get("/me", requireAuth, getMe);
userRouter.patch("/me", requireAuth, patchMe);
userRouter.patch("/me/availability", requireAuth, patchAvailability);
userRouter.post("/me/donate", requireAuth, writeLimiter, postDonateToday);
userRouter.get("/me/history", requireAuth, getMyHistory);
