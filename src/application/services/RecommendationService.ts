// Application Service - Contains business logic and use cases
// Depends only on domain layer interfaces

import { Recommendation } from "@/domain/entities/Recommendation";
import { IRecommendationRepository } from "@/domain/repositories/IRecommendationRepository";

export class RecommendationService {
  constructor(private readonly recommendationRepository: IRecommendationRepository) {}

  async RecommendCourses(
    interests_text: string,
    preferred_level: string,
    preferred_location: string,
    k: number = 3
  ): Promise<Recommendation[]> {
    return this.recommendationRepository.RecommendCourses(
      interests_text,
      preferred_level,
      preferred_location,
      k
    );
  }
}
