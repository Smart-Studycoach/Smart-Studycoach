// Infrastructure - Repository Implementation
// Implements the domain interface using external API

import { Recommendation } from "@/domain/entities/Recommendation";
import { IRecommendationRepository } from "@/domain/repositories/IRecommendationRepository";
import { RecommendationMapper } from "../mappers/RecommendationMapper";
import { RecommendationDto } from "@/application/dto/RecommendationDto";

export class RecommendationRepository implements IRecommendationRepository {
  private readonly baseUrl = "http://localhost:8000";
  private readonly apiKey = "dev-api-key-12345";
  private healthCheckCache: { isHealthy: boolean; timestamp: number } | null =
    null;
  private readonly healthCheckCacheDuration = 30000; // 30 seconds

  private async checkHealth(): Promise<boolean> {
    // Return cached result if still valid
    if (this.healthCheckCache) {
      const age = Date.now() - this.healthCheckCache.timestamp;
      if (age < this.healthCheckCacheDuration) {
        return this.healthCheckCache.isHealthy;
      }
    }

    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: "GET",
        headers: {
          "X-API-Key": this.apiKey,
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      const isHealthy = response.ok;
      this.healthCheckCache = {
        isHealthy,
        timestamp: Date.now(),
      };

      return isHealthy;
    } catch (err) {
      this.healthCheckCache = {
        isHealthy: false,
        timestamp: Date.now(),
      };
      return false;
    }
  }

  async recommendCourses(
    interests_text: string,
    preferred_level: string,
    preferred_location: string,
    k: number = 3
  ): Promise<Recommendation[]> {
    // Check API health first
    const isHealthy = await this.checkHealth();
    if (!isHealthy) {
      throw new Error(
        "Recommendation API is niet beschikbaar. Probeer het later opnieuw."
      );
    }

    try {
      const response = await fetch(`${this.baseUrl}/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
        },
        body: JSON.stringify({
          interests_text,
          preferred_level,
          preferred_location,
          k,
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
