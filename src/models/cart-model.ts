import mongoose from "mongoose";

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart {
  guestId: string;
  items: ICartItem[];
  expiresAt: Date;
}

const cartSchema = new mongoose.Schema(
  {
    guestId: {
      type: String,
      required: [true, "Guest ID is required"],
      unique: true,
      trim: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],

    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true },
);

cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Cart = mongoose.model("Cart", cartSchema);
