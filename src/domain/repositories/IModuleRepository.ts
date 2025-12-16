// Domain Repository Interface - Defines the contract for data access
// Infrastructure layer implements this interface

import { Module } from "../entities/Module";

export interface IModuleRepository {
  findAll(): Promise<Module[]>;
}
