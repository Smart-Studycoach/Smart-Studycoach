// Infrastructure - Repository Implementation
// Implements the domain interface using Mongoose

import { Module, IModuleRepository, ModuleFilters } from "@/domain";
import { connectToDatabase } from "../database/mongodb";
import { ModuleModel, IModuleDocument } from "../database/models/ModuleModel";

export class ModuleRepository implements IModuleRepository {
  private mapToEntity(doc: IModuleDocument): Module {
    return {
      _id: doc._id.toString(),
      module_id: doc.module_id,
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

  async findAll(filters?: ModuleFilters): Promise<Module[]> {
    await connectToDatabase();
    
    const query: any = {};
    
    if (filters?.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }
    
    if (filters?.level) {
      query.level = filters.level;
    }
    
    if (filters?.studycredit) {
      query.studycredit = filters.studycredit;
    }
    
    if (filters?.location) {
      query.location = { $in: [filters.location] };
    }
    
    if (filters?.estimated_difficulty) {
      query.estimated_difficulty = filters.estimated_difficulty;
    }
    
    const docs = await ModuleModel.find(query);
    return docs.map((doc) => this.mapToEntity(doc as IModuleDocument));
  }

  async findById(module_id: string): Promise<Module | null> {
    await connectToDatabase();
    const doc = await ModuleModel.findOne({ module_id: parseInt(module_id) });
    if (!doc) return null;
    return this.mapToEntity(doc as IModuleDocument);
  }
}
