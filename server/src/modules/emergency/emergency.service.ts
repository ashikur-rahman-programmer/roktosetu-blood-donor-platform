import { EmergencyRequest } from "./emergency.model";
import { getNativeDb } from "../../config/db";
import { sendSms } from "../../lib/notify";

interface UserDoc {
  _id: string;
  phone?: string;
  bloodGroup?: string;
  division?: string;
  isAvailable?: boolean;
}

export interface EmergencyFilters {
  status?: "open" | "fulfilled";
  division?: string;
  bloodGroup?: string;
  page: number;
  limit: number;
}

export async function listEmergencyRequests(filters: EmergencyFilters) {
  const query: Record<string, unknown> = {};
  if (filters.status) query.status = filters.status;
  if (filters.division) query.division = filters.division;
  if (filters.bloodGroup) query.bloodGroup = filters.bloodGroup;

  const skip = (filters.page - 1) * filters.limit;

  const [items, total] = await Promise.all([
    EmergencyRequest.find(query)
      .sort({ urgency: 1, createdAt: -1 })
      .skip(skip)
      .limit(filters.limit)
      .lean(),
    EmergencyRequest.countDocuments(query),
  ]);

  return { items, total, page: filters.page, limit: filters.limit };
}

export async function createEmergencyRequest(
  postedByUserId: string,
  data: Record<string, unknown>
) {
  const created = await EmergencyRequest.create({ ...data, postedByUserId, status: "open" });

  // Best-effort: alert matching, currently-available donors by SMS. This
  // never blocks or fails the request creation — see server/src/lib/notify.ts
  // for why nothing is actually delivered yet without a real SMS provider.
  notifyMatchingDonors(created).catch((err) =>
    console.error("[emergency] donor notification failed", err)
  );

  return created;
}

async function notifyMatchingDonors(request: {
  bloodGroup: string;
  division: string;
  hospital: string;
  district: string;
}) {
  const donors = await getNativeDb()
    .collection<UserDoc>("user")
    .find(
      {
        bloodGroup: request.bloodGroup,
        division: request.division,
        isAvailable: true,
      },
      { projection: { phone: 1 } }
    )
    .limit(50)
    .toArray();

  await Promise.all(
    donors
      .filter((d) => d.phone)
      .map((d) =>
        sendSms({
          to: d.phone!,
          message: `RoktoSetu: আপনার এলাকায় (${request.district}) জরুরি ${request.bloodGroup} রক্ত প্রয়োজন — ${request.hospital}। বিস্তারিত: roktosetu.org/emergency`,
        })
      )
  );
}

export async function markFulfilled(id: string, postedByUserId: string) {
  return EmergencyRequest.findOneAndUpdate(
    { _id: id, postedByUserId },
    { $set: { status: "fulfilled" } },
    { new: true }
  );
}
