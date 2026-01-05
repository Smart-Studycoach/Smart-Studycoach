// Application Service - Contains business logic and use cases
// Depends only on domain layer interfaces

import { Module, IModuleRepository, ModuleFilters } from "@/domain";

export class ModuleService {
  constructor(private readonly moduleRepository: IModuleRepository) {}

  async getAllModules(filters?: ModuleFilters): Promise<Module[]> {
    return this.moduleRepository.findAll(filters);
  }

  async getModuleById(id: string): Promise<Module | null> {
    return this.moduleRepository.findById(id);
  }
}
