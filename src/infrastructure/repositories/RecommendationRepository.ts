// Infrastructure - Repository Implementation
// Implements the domain interface using Mongoose

import { Recommendation, IRecommendationRepository } from "@/domain";
import { connectToDatabase } from "../database/mongodb";
import { ModuleModel, IModuleDocument } from "../database/models/ModuleModel";
import { RecommendationMapper } from "../mappers/RecommendationMapper";
import { RecommendationDto } from "../dto/RecommendationDTO";

export class RecommendationRepository implements IRecommendationRepository {
  async RecommendCourses(
    interests_text: string,
    preferred_level: string
  ): Promise<Recommendation[]> {
    const response = await fetch("http://localhost:8000/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": process.env.X_API_Key ?? "",
      },
      body: JSON.stringify({
        interests_text,
        preferred_level,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = (await response.json()) as RecommendationDto[];

    return RecommendationMapper.toDomainList(data);
  }
}
