// Infrastructure - Repository Implementation
// Implements the domain interface using Mongoose

import { Recommendation, IRecommendationRepository } from "@/domain";
import { RecommendationMapper } from "../mappers/RecommendationMapper";
import { RecommendationDto } from "../dto/RecommendationDTO";

export class RecommendationRepository implements IRecommendationRepository {
  async RecommendCourses(
    interests_text: string,
    preferred_level: string
  ): Promise<Recommendation[]> {
    try {
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
        let bodyText: string;
        try {
          bodyText = await response.text();
        } catch (e) {
          bodyText = "<unable to read response body>";
        }

        const headersList = Array.from(response.headers.entries())
          .map(([k, v]) => `${k}: ${v}`)
          .join("; ");

        throw new Error(
          `HTTP error ${response.status} ${response.statusText} when calling ${response.url}. Headers: ${headersList}. Body: ${bodyText}`
        );
      }

      const data = (await response.json()) as RecommendationDto[];
      return RecommendationMapper.toDomainList(data);
    } catch (err) {
      throw new Error(
        `RecommendationRepository.RecommendCourses failed: ${err}`
      );
    }
  }
}
