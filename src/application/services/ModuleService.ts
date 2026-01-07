// Application Service - Contains business logic and use cases
// Depends only on domain layer interfaces

import {
  Module,
  ModuleMinimal,
  IModuleRepository,
  ModuleFilters,
  IUserRepository,
  mongoDB_id,
} from "@/domain";

export class ModuleService {
  constructor(
    private readonly moduleRepository: IModuleRepository,
    private readonly userRepository: IUserRepository
  ) {}

  async getAllModules(filters?: ModuleFilters): Promise<Module[]> {
    return this.moduleRepository.findAll(filters);
  }

  async getModuleById(id: string): Promise<Module | null> {
    return this.moduleRepository.findById(id);
  }

  async getModulesByModule_Ids(
    _ids: mongoDB_id[]
  ): Promise<ModuleMinimal[] | null> {
    const modules = await this.moduleRepository.findMinimalsByIds(_ids);
    if (!modules) return null;
    return modules;
  }

  async updateChosenModule(
    user_id: mongoDB_id,
    _id: mongoDB_id,
    chosen: boolean
  ): Promise<boolean> {
    if (chosen) {
      return this.moduleRepository.addChosenModule(user_id, _id);
    } else {
      return this.moduleRepository.pullChosenModule(user_id, _id);
    }
  }

  async getMongoIdByModuleId(module_id: string): Promise<mongoDB_id | null> {
    return this.moduleRepository.findMongoIdByModuleId(module_id);
  }
}
