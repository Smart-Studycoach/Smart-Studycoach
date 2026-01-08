// Application Service - Contains business logic and use cases
// Depends only on domain layer interfaces

import {
  Module,
  ModuleMinimal,
  IModuleRepository,
  ModuleFilters,
  IUserRepository,
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
    module_ids: number[]
  ): Promise<ModuleMinimal[] | null> {
    const modules = await this.moduleRepository.findMinimalsByIds(module_ids);
    if (!modules) return null;
    return modules;
  }

  async updateChosenModule(
    user_id: string,
    module_id: number,
    chosen: boolean
  ): Promise<boolean> {
    if (chosen) {
      return this.moduleRepository.addChosenModule(user_id, module_id);
    } else {
      return this.moduleRepository.pullChosenModule(user_id, module_id);
    }
  }

  // async getMongoIdByModuleId(module_id: string): Promise<string | null> {
  //   return this.moduleRepository.findMongoIdByModuleId(module_id);
  // }
}
