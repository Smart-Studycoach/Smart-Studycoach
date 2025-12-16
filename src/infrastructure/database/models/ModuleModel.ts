// Infrastructure - Mongoose Model (Database Schema)
import mongoose, { Schema, Document } from "mongoose";

export interface IModuleDocument extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema = new Schema<IModuleDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

// Use existing model if it exists (for hot reload), otherwise create new one
export const ModuleModel =
  mongoose.models.Module ||
  mongoose.model<IModuleDocument>("Module", ModuleSchema);
