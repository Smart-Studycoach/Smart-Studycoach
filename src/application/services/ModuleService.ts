// Application Service - Contains business logic and use cases
// Depends only on domain layer interfaces

import {
  Module,
  IModuleRepository,
  ModuleFilters,
  IUserRepository,
  User,
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

  async updateChosenModule(
    user_id: string,
    module_id: string,
    chosen: boolean
  ): Promise<boolean> {
    if (chosen) {
      return this.moduleRepository.addChosenModule(user_id, module_id);
    } else {
      return this.moduleRepository.pullChosenModule(user_id, module_id);
    }
  }
}
