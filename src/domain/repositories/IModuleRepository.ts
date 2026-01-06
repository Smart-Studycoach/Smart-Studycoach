// Domain Repository Interface - Defines the contract for data access
// Infrastructure layer implements this interface

import { Module, ModuleMinimal } from "../entities/Module";
import { User } from "@/domain";

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
  addChosenModule(user_id: string, module_id: string): Promise<boolean>;
  pullChosenModule(user_id: string, module_id: string): Promise<boolean>;
  findMinimalsByIds(module_ids: string[]): Promise<ModuleMinimal[] | null>;
}
