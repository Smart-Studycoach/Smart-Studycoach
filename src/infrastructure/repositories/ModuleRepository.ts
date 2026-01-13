// Infrastructure - Repository Implementation
// Implements the domain interface using Mongoose

import {
  Module,
  ModuleMinimal,
  IModuleRepository,
  ModuleFilters,
} from "@/domain";
import { connectToDatabase } from "../database/mongodb";
import { ModuleModel, IModuleDocument } from "../database/models/ModuleModel";
import {
  User,
  CreateUserDTO,
  LoginDTO,
  AuthResponse,
  IUserRepository,
  IAuthService,
} from "@/domain";
import { UserModel } from "../database/models/UserModel";

export class ModuleRepository implements IModuleRepository {
  constructor(private readonly userRepository: IUserRepository) {}
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

    // Use a more specific type for the MongoDB query
    const query: Record<string, unknown> = {};

    if (filters?.name) {
      // Escape special regex characters to prevent injection
      const escapedName = filters.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      query.name = { $regex: escapedName, $options: "i" };
    }

    if (filters?.level) {
      query.level = filters.level;
    }

    if (filters?.studycredit) {
      query.studycredit = filters.studycredit;
    }

    if (filters?.location) {
      query.location = filters.location;
    }

    if (filters?.estimated_difficulty) {
      query.estimated_difficulty = filters.estimated_difficulty;
    }

    const docs = await ModuleModel.find(query);
    return docs.map((doc) => this.mapToEntity(doc as IModuleDocument));
  }

  async findById(module_id: string): Promise<Module | null> {
    await connectToDatabase();
    const parsedId = Number.parseInt(module_id, 10);
    if (Number.isNaN(parsedId)) return null;
    const doc = await ModuleModel.findOne({ module_id: parsedId });
    if (!doc) return null;
    return this.mapToEntity(doc as IModuleDocument);
  }

  async findMinimalsByIds(
    module_ids: number[]
  ): Promise<ModuleMinimal[] | null> {
    await connectToDatabase();

    const docs = await ModuleModel.find({
      module_id: { $in: module_ids },
    }).select("module_id name");
    if (!docs) return null;
    return docs.map((d) => ({
      module_id: (d as IModuleDocument).module_id,
      name: (d as IModuleDocument).name,
    }));
  }

  async findModulesByIds(module_ids: number[]): Promise<Module[] | null> {
    await connectToDatabase();

    const docs = await ModuleModel.find({
      module_id: { $in: module_ids },
    });
    if (!docs) return null;
    return docs.map((d) => ({
      _id: String((d as IModuleDocument)._id),
      module_id: (d as IModuleDocument).module_id,
      name: (d as IModuleDocument).name,
      shortdescription: (d as IModuleDocument).shortdescription,
      description: (d as IModuleDocument).description,
      studycredit: (d as IModuleDocument).studycredit,
      location: (d as IModuleDocument).location,
      level: (d as IModuleDocument).level,
      learningoutcomes: (d as IModuleDocument).learningoutcomes,
      estimated_difficulty: (d as IModuleDocument).estimated_difficulty,
      available_spots: (d as IModuleDocument).available_spots,
      start_date: (d as IModuleDocument).start_date,
    }));
  }
}
