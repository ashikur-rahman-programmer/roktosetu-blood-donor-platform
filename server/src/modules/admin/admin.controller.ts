import type { Request, Response } from "express";
import { getNativeDb } from "../../config/db";
import { ok } from "../../utils/apiResponse";

interface UserDoc {
  _id: string;
  [key: string]: unknown;
}

export async function listUnverifiedDonors(_req: Request, res: Response) {
  const db = getNativeDb();
  const donors = await db
    .collection<UserDoc>("user")
    .find(
      { verified: { $ne: true } },
      { projection: { name: 1, phone: 1, bloodGroup: 1, division: 1, district: 1, createdAt: 1 } }
    )
    .sort({ createdAt: -1 })
    .toArray();
  ok(res, donors);
}

export async function verifyDonor(req: Request, res: Response) {
  const db = getNativeDb();
  const id = String(req.params.id);
  await db.collection<UserDoc>("user").updateOne({ _id: id }, { $set: { verified: true } });
  ok(res, { verified: true });
}

export async function removeDonor(req: Request, res: Response) {
  const db = getNativeDb();
  const id = String(req.params.id);
  await db.collection<UserDoc>("user").deleteOne({ _id: id });
  // Also clean up their sessions so a removed account can't keep using an
  // existing cookie.
  await db.collection("session").deleteMany({ userId: id });
  ok(res, { removed: true });
}
