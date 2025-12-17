// Infrastructure - Repository Implementation
// Implements the domain interface using Mongoose

import { Module, IModuleRepository } from "@/domain";
import { connectToDatabase } from "../database/mongodb";
import { ModuleModel, IModuleDocument } from "../database/models/ModuleModel";

export class ModuleRepository implements IModuleRepository {
  private mapToEntity(doc: IModuleDocument): Module {
    return {
      _id: doc._id.toString(),
      id: doc.id,
      name: doc.name,
      shortdescription: doc.shortdescription,
      description: doc.description,
      studycredit: doc.studycredit,
      location: doc.location,
      level: doc.level,
      learningoutcomes: doc.learningoutcomes,
      estimated_difficulty: doc.estimated_difficulty,
      available_spots: doc.available_spots,
      start_date: doc.start_date,
    };
  }

  async findAll(): Promise<Module[]> {
    await connectToDatabase();
    const docs = await ModuleModel.find({});
    return docs.map((doc) => this.mapToEntity(doc as IModuleDocument));
  }

  async findById(id: string): Promise<Module | null> {
    await connectToDatabase();
    const doc = await ModuleModel.findOne({ id });
    if (!doc) return null;
    return this.mapToEntity(doc as IModuleDocument);
  }
}
