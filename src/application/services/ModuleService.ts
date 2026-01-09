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
}
