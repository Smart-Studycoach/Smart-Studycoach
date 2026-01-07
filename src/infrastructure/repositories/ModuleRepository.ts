// Infrastructure - Repository Implementation
// Implements the domain interface using Mongoose

import {
  Module,
  ModuleMinimal,
  IModuleRepository,
  ModuleFilters,
  mongoDB_id,
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

  async findMongoIdByModuleId(module_id: string): Promise<mongoDB_id | null> {
    await connectToDatabase();
    const parsedId = Number.parseInt(module_id, 10);
    if (Number.isNaN(parsedId)) return null;
    const doc = await ModuleModel.findOne({ module_id: parsedId }).select(
      "_id"
    );
    if (!doc) return null;
    return (doc as IModuleDocument)._id.toString();
  }

  async findMinimalsByIds(_ids: mongoDB_id[]): Promise<ModuleMinimal[] | null> {
    await connectToDatabase();

    const doc = await ModuleModel.find({
      _id: { $in: _ids },
    }).select("module_id name");
    if (!doc) return null;
    return doc.map((d) => ({
      _id: (d as IModuleDocument)._id.toString(),
      module_id: (d as IModuleDocument).module_id,
      name: (d as IModuleDocument).name,
    }));
  }

  async addChosenModule(
    user_id: mongoDB_id,
    _id: mongoDB_id
  ): Promise<boolean> {
    await connectToDatabase();
    const doc = await UserModel.updateOne(
      { _id: user_id },
      { $addToSet: { chosenModules: _id } }
    );
    if (!doc) return false;
    return true;
  }

  async pullChosenModule(
    user_id: mongoDB_id,
    _id: mongoDB_id
  ): Promise<boolean> {
    await connectToDatabase();
    const doc = await UserModel.updateOne(
      { _id: user_id },
      { $pull: { chosenModules: _id } }
    );
    if (!doc) return false;
    return true;
  }
}
