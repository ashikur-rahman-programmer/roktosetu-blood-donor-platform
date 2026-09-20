import type { Request, Response, NextFunction } from "express";
import {
  searchDonors,
  markDonatedToday,
  toggleAvailability,
  updateProfile,
  getDonationHistory,
  toPublicUser,
} from "./user.service";
import { donorSearchQuerySchema, updateProfileSchema } from "./user.validation";
import { ok } from "../../utils/apiResponse";

export async function getMe(req: Request, res: Response) {
  ok(res, toPublicUser(req.user!));
}

export async function patchMe(req: Request, res: Response, next: NextFunction) {
  try {
    const patch = updateProfileSchema.parse(req.body);
    await updateProfile(req.user!.id, patch);
    ok(res, { updated: true });
  } catch (err) {
    next(err);
  }
}

export async function postDonateToday(req: Request, res: Response) {
  const updated = await markDonatedToday(req.user!.id);
  ok(res, updated);
}

export async function patchAvailability(req: Request, res: Response) {
  const isAvailable = Boolean(req.body?.isAvailable);
  await toggleAvailability(req.user!.id, isAvailable);
  ok(res, { isAvailable });
}

export async function getMyHistory(req: Request, res: Response) {
  const history = await getDonationHistory(req.user!.id);
  ok(res, history);
}

export async function getDonorSearch(req: Request, res: Response, next: NextFunction) {
  try {
    const filters = donorSearchQuerySchema.parse(req.query);
    const result = await searchDonors(filters, req.user!.id);
    ok(res, result);
  } catch (err) {
    next(err);
  }
}
