import { Schema, model, Document } from "mongoose";

export interface IOrderItem {
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  guestId: string;

  customerName: string;
  contactNumber: string;
  deliveryAddress: string;

  items: IOrderItem[];

  paymentMethod: "COD" | "Online";

  status: "pending" | "accepted" | "dispatch" | "delivered" | "cancelled";

  totalPrice: number;

  isPaymentTransferred: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    guestId: {
      type: String,
      required: true,
      index: true,
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    contactNumber: {
      type: String,
      required: true,
      trim: true,
    },

    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],

    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "dispatch", "delivered", "cancelled"],
      default: "pending",
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    isPaymentTransferred: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const Order = model<IOrder>("Order", orderSchema);
