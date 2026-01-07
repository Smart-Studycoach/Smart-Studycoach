// Infrastructure - Mongoose Model (Database Schema)
import mongoose, { Schema, Document } from "mongoose";

export interface IModuleDocument extends Document {
  module_id: number;
  name: string;
  shortdescription: string[];
  description: string;
  studycredit: number;
  location: string[];
  level: string;
  learningoutcomes: string;
  estimated_difficulty: number;
  available_spots: number;
  start_date: string;
}

const ModuleSchema = new Schema<IModuleDocument>(
  {
    module_id: { type: Number, required: true },
    name: { type: String, required: true },
    shortdescription: { type: [String] },
    description: { type: String },
    studycredit: { type: Number },
    location: { type: [String] },
    level: { type: String },
    learningoutcomes: { type: String },
    estimated_difficulty: { type: Number },
    available_spots: { type: Number },
    start_date: { type: String },
  },
  { collection: "Modules" } // Use existing collection name
);

// Use existing model if it exists (for hot reload), otherwise create new one
export const ModuleModel =
  mongoose.models.Module ||
  mongoose.model<IModuleDocument>("Module", ModuleSchema);
