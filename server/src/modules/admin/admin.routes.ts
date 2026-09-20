import { Router } from "express";
import { requireAuth } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/rbac.middleware";
import { listUnverifiedDonors, verifyDonor, removeDonor } from "./admin.controller";

export const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("admin"));

adminRouter.get("/donors/unverified", listUnverifiedDonors);
adminRouter.patch("/donors/:id/verify", verifyDonor);
adminRouter.delete("/donors/:id", removeDonor);
