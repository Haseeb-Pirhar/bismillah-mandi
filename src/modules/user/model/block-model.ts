import mongoose, { Document, Schema } from "mongoose";

export interface IBlock extends Document {
  blocker: mongoose.Types.ObjectId;
  blocked: mongoose.Types.ObjectId;
  reason?: string;
  createdAt: Date;
  expiresAt?: Date;
}

const blockSchema = new Schema<IBlock>(
  {
    blocker: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    blocked: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export const Block = mongoose.model<IBlock>("Block", blockSchema);
