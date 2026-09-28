import mongoose, { type InferSchemaType } from "mongoose";

// mongoose is CommonJS: Node's native ESM loader only allows the default
// import from it, so named exports are destructured from that default.
const { Schema, model, models } = mongoose;

const phoneViewLogSchema = new Schema(
  {
    viewerId: { type: String, required: true, index: true },
    donorIds: { type: [String], required: true },
    query: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export type PhoneViewLogDoc = InferSchemaType<typeof phoneViewLogSchema>;

export const PhoneViewLog =
  models.PhoneViewLog || model("PhoneViewLog", phoneViewLogSchema);
