// Infrastructure - Repository Implementation
// Implements the domain interface using Mongoose

import { Module, IModuleRepository } from "@/domain";
import { connectToDatabase } from "../database/mongodb";
import { ModuleModel, IModuleDocument } from "../database/models/ModuleModel";

export class ModuleRepository implements IModuleRepository {
  private mapToEntity(doc: IModuleDocument): Module {
    return {
      id: doc._id.toString(),
      name: doc.name,
      description: doc.description,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findAll(): Promise<Module[]> {
    await connectToDatabase();
    const docs = await ModuleModel.find({});
    return docs.map((doc) => this.mapToEntity(doc as IModuleDocument));
  }
}
