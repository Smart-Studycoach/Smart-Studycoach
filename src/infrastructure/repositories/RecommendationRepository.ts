// Infrastructure - Repository Implementation
// Implements the domain interface using external API

import { Recommendation } from "@/domain/entities/Recommendation";
import { IRecommendationRepository } from "@/domain/repositories/IRecommendationRepository";
import { RecommendationMapper } from "../mappers/RecommendationMapper";
import { RecommendationDto } from "@/application/dto/RecommendationDto";

class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public url: string,
    public body?: string
  ) {
    super(message);
    this.name = "HttpError";
  }
}

export class RecommendationRepository implements IRecommendationRepository {
  private readonly baseUrl = "http://localhost:8000";
  private readonly apiKey = "dev-api-key-12345"; // In production, this MUST be an environment variable
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    if (!(await this.checkHealth())) {
      throw new HttpError(
        "Recommendation API is unavailable.",
        503,
        `${this.baseUrl}/health`
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
        let body: string | undefined;
        try {
          body = await response.text();
        } catch {
          body = undefined;
        }

        throw new HttpError(
          `Recommendation API returned ${response.status}`,
          response.status,
          response.url,
          body
        );
      }

      const data = (await response.json()) as RecommendationDto[];
      return RecommendationMapper.toDomainList(data);
    } catch (err: unknown) {
      if (err instanceof HttpError) {
        throw err;
      }

      if (err instanceof SyntaxError) {
        throw new Error("Failed to parse recommendation API response", {
          cause: err,
        });
      }

      if (err instanceof Error) {
        throw new Error("RecommendationRepository.recommendCourses failed", {
          cause: err,
        });
      }

      throw new Error("Unknown error in recommendCourses", { cause: err });
    }
  }
}
