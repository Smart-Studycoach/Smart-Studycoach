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
      type: [String],
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

// Index for faster email lookups
UserSchema.index({ email: 1 });

export const UserModel =
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
