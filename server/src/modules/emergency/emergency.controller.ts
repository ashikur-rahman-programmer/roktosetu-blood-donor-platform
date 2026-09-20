import type { Request, Response, NextFunction } from "express";
import {
  listEmergencyRequests,
  createEmergencyRequest,
  markFulfilled,
} from "./emergency.service";
import { createEmergencyRequestSchema, listEmergencyQuerySchema } from "./emergency.validation";
import { ok } from "../../utils/apiResponse";
import { AppError } from "../../middlewares/error.middleware";

export async function getEmergencyRequests(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = listEmergencyQuerySchema.parse(req.query);
    const result = await listEmergencyRequests(filters);
    ok(res, result);
  } catch (err) {
    next(err);
  }
}

export async function postEmergencyRequest(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createEmergencyRequestSchema.parse(req.body);
    const created = await createEmergencyRequest(req.user!.id, data);
    ok(res, created, 201);
  } catch (err) {
    next(err);
  }
}

export async function patchFulfilled(req: Request, res: Response, next: NextFunction) {
  try {
    const updated = await markFulfilled(String(req.params.id), req.user!.id);
    if (!updated) {
      throw new AppError(404, "অনুরোধটি খুঁজে পাওয়া যায়নি অথবা এটি আপনার পোস্ট করা নয়");
    }
    ok(res, updated);
  } catch (err) {
    next(err);
  }
}
