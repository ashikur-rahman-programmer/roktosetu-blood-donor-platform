import { Schema, model, models, type InferSchemaType } from "mongoose";

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
