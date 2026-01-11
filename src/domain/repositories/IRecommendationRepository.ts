// Domain Repository Interface - Defines the contract for data access
// Infrastructure layer implements this interface

import { Recommendation } from "../entities/Recommendation";

export interface IRecommendationRepository {
  recommendCourses(
    interests_text: string,
    preferred_level: string,
    preferred_location: string,
    k?: number
  ): Promise<Recommendation[]>;
}
