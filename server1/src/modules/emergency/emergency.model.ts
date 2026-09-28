import mongoose, { type InferSchemaType } from "mongoose";

// mongoose is CommonJS: Node's native ESM loader only allows the default
// import from it, so named exports are destructured from that default.
const { Schema, model, models } = mongoose;

const emergencyRequestSchema = new Schema(
  {
    postedByUserId: { type: String, required: true, index: true },
    patientName: { type: String, required: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      index: true,
    },
    unitsNeeded: { type: Number, required: true, min: 1 },
    division: { type: String, required: true, index: true },
    district: { type: String, required: true, index: true },
    hospital: { type: String, required: true },
    contactPhone: { type: String, required: true },
    note: { type: String, default: "" },
    urgency: {
      type: String,
      required: true,
      enum: ["high", "medium", "low"],
      default: "high",
    },
    status: {
      type: String,
      required: true,
      enum: ["open", "fulfilled"],
      default: "open",
      index: true,
    },
  },
  { timestamps: true }
);

export type EmergencyRequestDoc = InferSchemaType<typeof emergencyRequestSchema>;

export const EmergencyRequest =
  models.EmergencyRequest || model("EmergencyRequest", emergencyRequestSchema);
