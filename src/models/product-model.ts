import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  title: string;
  slug: string;
  description: string;
  buyPrice?: number; // cost price (optional)
  myPrice?: number; // selling price
  images: string[];
  category: mongoose.Types.ObjectId;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  discount?: number;
  tags?: string[];
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    buyPrice: {
      type: Number,
      min: 0,
    },

    myPrice: {
      type: Number,
      required: true, // 👈 selling price must exist
      min: 0,
    },

    images: {
      type: [String],
      default: [],
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    discount: {
      type: Number,
      default: 0,
    },

    tags: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
