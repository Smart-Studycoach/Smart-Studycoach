// Dependency Injection Container
// Wires up all dependencies - this is the composition root

import { ModuleService, AuthApplicationService, UserService } from "@/application";
import { ModuleRepository } from "../repositories/ModuleRepository";
import { UserRepository } from "../repositories/UserRepository";
import { AuthServiceInfrastructure } from "../services/AuthServiceInfrastructure";

// Create repository instances

const userRepository = new UserRepository();
const moduleRepository = new ModuleRepository(userRepository);

// Create infrastructure service instances
export const authService = new AuthServiceInfrastructure();

// Create application service instances with injected dependencies
export const moduleService = new ModuleService(
  moduleRepository,
  userRepository
);
export const authApplicationService = new AuthApplicationService(
  userRepository,
  authService
);

export const userService = new UserService(userRepository);