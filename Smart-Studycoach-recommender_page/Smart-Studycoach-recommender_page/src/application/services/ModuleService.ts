// Application Service - Contains business logic and use cases
// Depends only on domain layer interfaces

import { Module, IModuleRepository } from "@/domain";

export class ModuleService {
  constructor(private readonly moduleRepository: IModuleRepository) {}

  async getAllModules(): Promise<Module[]> {
    return this.moduleRepository.findAll();
  }
}
