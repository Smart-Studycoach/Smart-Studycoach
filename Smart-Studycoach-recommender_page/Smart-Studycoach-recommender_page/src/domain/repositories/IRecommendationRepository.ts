// Domain Repository Interface - Defines the contract for data access
// Infrastructure layer implements this interface

import { Recommendation } from "@/domain";

export interface IRecommendationRepository {
  RecommendCourses(
    interests_text: string,
    preferred_level: string
  ): Promise<Recommendation[]>;
}
