// Application Service - Contains business logic and use cases
// Depends only on domain layer interfaces

import { Recommendation, IRecommendationRepository } from "@/domain";

export class RecommendationService {
  constructor(private readonly moduleRepository: IRecommendationRepository) {}

  async RecommendCourses(
    interests_text: string,
    preferred_level: string
  ): Promise<Recommendation[]> {
    return this.moduleRepository.RecommendCourses(
      interests_text,
      preferred_level
    );
  }
}
