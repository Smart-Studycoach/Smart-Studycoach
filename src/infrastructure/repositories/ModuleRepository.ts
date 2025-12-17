// Infrastructure - Repository Implementation
// Implements the domain interface using Mongoose

import { Module, IModuleRepository } from "@/domain";
import { connectToDatabase } from "../database/mongodb";
import { ModuleModel, IModuleDocument } from "../database/models/ModuleModel";
import { ModuleMapper } from "../mappers/ModuleMapper";

export class ModuleRepository implements IModuleRepository {
  async findAll(): Promise<Module[]> {
    await connectToDatabase();
    const docs = await ModuleModel.find({});
    return docs.map((doc) => ModuleMapper.mapToDomain(doc as IModuleDocument));
  }
}
