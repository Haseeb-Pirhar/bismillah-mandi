import mongoose, { Document, Model } from "mongoose";

const userTypes = ["temp", "admin"] as const;

export interface IUser extends Document {
  email?: string;
  fullName?: string;
  username: string;
  password?: string;
  otp?: string;
  otpExpires?: Date;
  dob?: string;
  phone?: string;
  gender?: "Male" | "Female" | "Other" | string;
  image?: string;
  coverImage?: string;
  city?: string;
  interests?: string[];
  bio?: string;
  location?: {
    type: "Point";
    coordinates: [number, number];
  };
  address?: string;
  shippingAddress?: string;
  country?: string;
  zip?: string;
  device?: string;
  type?: (typeof userTypes)[number];
  platform?: string;
  channels?: string[];
  isVerified?: boolean;
  isActive?: boolean;
  language?: "en" | "ar" | "fr" | "sp" | string;
  createdAt?: Date;
  updatedAt?: Date;
  totalListing: number;
  currency: string;
}

interface IUserMethods {
  toJSON(): any;
}

type UserModel = Model<IUser, object, IUserMethods>;

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
    },
    fullName: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    bio: String,
    phone: {
      type: String,
      trim: true,
    },
    interests: [String],
    otp: String,
    otpExpires: Date,
    city: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      enum: ["en", "ar", "fr", "sp"],
      default: "ar",
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    totalListing: {
      type: Number,
      default: 0,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    address: String,
    shippingAddress: String,
    country: String,
    zip: String,
    image: String,
    coverImage: String,
    device: String,
    platform: String,
    type: {
      type: String,
      enum: userTypes,
      default: "admin",
    },
    currency: {
      type: String,
      default: "USD",
    },
    channels: [String],
  },
  {
    timestamps: true,
  },
);

userSchema.index({ location: "2dsphere" });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

export const User = mongoose.model<IUser, UserModel>("User", userSchema);
