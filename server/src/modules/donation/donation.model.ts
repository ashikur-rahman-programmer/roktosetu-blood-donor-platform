import { Schema, model, models, type InferSchemaType } from "mongoose";

const donationHistorySchema = new Schema(
  {
    // References Better Auth's user._id (stored as string there).
    userId: { type: String, required: true, index: true },
    donatedAt: { type: Date, required: true },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export type DonationHistoryDoc = InferSchemaType<typeof donationHistorySchema>;

export const DonationHistory =
  models.DonationHistory || model("DonationHistory", donationHistorySchema);
