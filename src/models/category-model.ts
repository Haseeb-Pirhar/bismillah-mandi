import mongoose from "mongoose";

export interface ICategory {
  name: string;
  image?: string;
  slug: string;
}

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      trim: true,
      unique: true,
    },
  },
  { timestamps: true },
);

export const Category = mongoose.model("Category", categorySchema);
