// Domain Repository Interface - Defines the contract for data access
// Infrastructure layer implements this interface

import { Module, ModuleMinimal } from "../entities/Module";

export interface ModuleFilters {
  name?: string;
  level?: string;
  studycredit?: number;
  location?: string;
  estimated_difficulty?: number;
}

export interface IModuleRepository {
  findAll(filters?: ModuleFilters): Promise<Module[]>;
  findById(id: string): Promise<Module | null>;
  findMinimalsByIds(module_ids: number[]): Promise<ModuleMinimal[] | null>;
  findModulesByIds(module_ids: number[]): Promise<Module[] | null>;
}
