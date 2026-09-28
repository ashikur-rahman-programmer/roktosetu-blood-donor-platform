import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { writeLimiter } from "../../middlewares/rateLimit.middleware.js";
import {
  getEmergencyRequests,
  postEmergencyRequest,
  patchFulfilled,
} from "./emergency.controller.js";

export const emergencyRouter = Router();

// Public: anyone can see open emergency requests (no login needed to help).
emergencyRouter.get("/", getEmergencyRequests);

// Authenticated: posting and closing requests ties them to an accountable user.
emergencyRouter.post("/", requireAuth, writeLimiter, postEmergencyRequest);
emergencyRouter.patch("/:id/fulfilled", requireAuth, patchFulfilled);
