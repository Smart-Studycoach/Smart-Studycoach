import mongoose, { Schema, Document } from "mongoose";

export interface IUserDocument extends Document {
  email: string;
  password: string;
  name: string;
  studentProfile: string;
  favoriteModules?: string[];
  chosenModules?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    studentProfile: {
      type: String,
      required: true,
      trim: true,
    },
    favoriteModules: {
      type: [Number],
      default: [],
    },
    chosenModules: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "Users",
  }
);

// Email has a unique index via the `unique: true` field option

export const UserModel =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
