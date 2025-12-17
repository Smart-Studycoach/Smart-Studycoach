// Dependency Injection Container
// Wires up all dependencies - this is the composition root

import { ModuleService } from "@/application";
import { ModuleRepository } from "../repositories/ModuleRepository";
import { RecommendationService } from "@/application";
import { RecommendationRepository } from "../repositories/RecommendationRepository";

// Create repository instances
const moduleRepository = new ModuleRepository();
const recommendationRepository = new RecommendationRepository();

// Create service instances with injected dependencies
export const moduleService = new ModuleService(moduleRepository);
export const recommendationService = new RecommendationService(
  recommendationRepository
);
