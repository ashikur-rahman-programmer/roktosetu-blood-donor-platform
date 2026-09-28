import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/rbac.middleware.js";
import { listUnverifiedDonors, verifyDonor, removeDonor } from "./admin.controller.js";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get("/donors/unverified", listUnverifiedDonors);
adminRouter.patch("/donors/:id/verify", verifyDonor);
adminRouter.delete("/donors/:id", removeDonor);
