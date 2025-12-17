// Dependency Injection Container
// Wires up all dependencies - this is the composition root

import { ModuleService } from "@/application";
import { ModuleRepository } from "../repositories/ModuleRepository";

// Create repository instances
const moduleRepository = new ModuleRepository();

// Create service instances with injected dependencies
export const moduleService = new ModuleService(moduleRepository);
