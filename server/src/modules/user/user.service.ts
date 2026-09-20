import type { Db } from "mongodb";
import { getNativeDb } from "../../config/db";
import { DonationHistory } from "../donation/donation.model";
import { PhoneViewLog } from "./phoneViewLog.model";
import { env } from "../../config/env";
import { isEligible } from "../../utils/dateHelper";
import type { SessionUser } from "../../middlewares/auth.middleware";

interface UserDoc {
  _id: string;
  name?: string;
  phone?: string;
  bloodGroup?: string;
  division?: string;
  district?: string;
  upazila?: string;
  lastDonationDate?: Date | string | null;
  isAvailable?: boolean;
  donationCount?: number;
  verified?: boolean;
}

function userCollection(db: Db = getNativeDb()) {
  return db.collection<UserDoc>("user");
}

export interface DonorSearchFilters {
  bloodGroup?: string;
  division?: string;
  district?: string;
  onlyAvailable: boolean;
  page: number;
  limit: number;
}

/**
 * Search donors. "Available" here means both `isAvailable === true` AND the
 * donation-gap has elapsed — a donor who forgot to toggle themselves off is
 * still correctly excluded.
 *
 * `viewerId` is the logged-in searcher (search requires auth — see
 * user.routes.ts). Every call is logged to PhoneViewLog for accountability,
 * since results include donors' phone numbers directly.
 */
export async function searchDonors(filters: DonorSearchFilters, viewerId: string) {
  const query: Record<string, unknown> = {};
  if (filters.bloodGroup) query.bloodGroup = filters.bloodGroup;
  if (filters.division) query.division = filters.division;
  if (filters.district) query.district = filters.district;

  if (filters.onlyAvailable) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - env.DONATION_GAP_DAYS);
    query.isAvailable = true;
    query.$or = [{ lastDonationDate: null }, { lastDonationDate: { $lte: cutoff } }];
  }

  const col = userCollection();
  const skip = (filters.page - 1) * filters.limit;

  const [donors, total] = await Promise.all([
    col
      .find(query, {
        projection: {
          name: 1,
          phone: 1,
          bloodGroup: 1,
          division: 1,
          district: 1,
          upazila: 1,
          lastDonationDate: 1,
          isAvailable: 1,
          donationCount: 1,
          verified: 1,
        },
      })
      .sort({ isAvailable: -1, donationCount: -1 })
      .skip(skip)
      .limit(filters.limit)
      .toArray(),
    col.countDocuments(query),
  ]);

  const mappedDonors = donors.map((d) => ({
    id: String(d._id),
    name: d.name,
    // Shown directly to any logged-in searcher (search requires auth —
    // see user.routes.ts) so a donor is reachable without needing to be
    // online themselves to approve a request. This trades some privacy
    // for reliability; only signed-in users can search at all, and every
    // view is logged below for accountability.
    phone: d.phone,
    bloodGroup: d.bloodGroup,
    division: d.division,
    district: d.district,
    upazila: d.upazila,
    lastDonationDate: d.lastDonationDate ?? null,
    isAvailable: Boolean(d.isAvailable) && isEligible(d.lastDonationDate),
    donationCount: d.donationCount ?? 0,
    verified: Boolean(d.verified),
  }));

  // Fire-and-forget audit log — never blocks or fails the search response.
  if (mappedDonors.length > 0) {
    PhoneViewLog.create({
      viewerId,
      donorIds: mappedDonors.map((d) => d.id),
      query,
    }).catch((err) => console.error("[search] phone-view log failed", err));
  }

  return {
    donors: mappedDonors,
    total,
    page: filters.page,
    limit: filters.limit,
  };
}


/**
 * The core "I donated today" action:
 *  - stamps lastDonationDate = now
 *  - flips isAvailable to false (the daily cron flips it back after the gap)
 *  - increments donationCount
 *  - records a DonationHistory entry for the profile's badge/history list
 */
export async function markDonatedToday(userId: string) {
  const now = new Date();
  const col = userCollection();

  const result = await col.findOneAndUpdate(
    { _id: toObjectIdOrString(userId) },
    {
      $set: { lastDonationDate: now, isAvailable: false },
      $inc: { donationCount: 1 },
    },
    { returnDocument: "after" }
  );

  await DonationHistory.create({ userId, donatedAt: now });

  return result;
}

export async function toggleAvailability(userId: string, isAvailable: boolean) {
  const col = userCollection();
  await col.updateOne({ _id: toObjectIdOrString(userId) }, { $set: { isAvailable } });
}

export async function updateProfile(userId: string, patch: Record<string, unknown>) {
  const col = userCollection();
  await col.updateOne({ _id: toObjectIdOrString(userId) }, { $set: patch });
}

export async function getDonationHistory(userId: string) {
  return DonationHistory.find({ userId }).sort({ donatedAt: -1 }).lean();
}

export function toPublicUser(user: SessionUser) {
  const { ...publicFields } = user;
  return publicFields;
}

// Better Auth's mongodb adapter stores _id as whatever the driver generated
// (by default a string cuid, not a BSON ObjectId), so we intentionally do
// NOT cast to ObjectId here.
function toObjectIdOrString(id: string): string {
  return id;
}
