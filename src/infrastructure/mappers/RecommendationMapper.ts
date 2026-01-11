// infrastructure/mappers/RecommendationMapper.ts
import { Recommendation } from "@/domain/entities/Recommendation";
import { RecommendationDto } from "@/application/dto/RecommendationDto";

export class RecommendationMapper {
  static toDomain(dto: RecommendationDto): Recommendation {
    return new Recommendation(
      dto.module_id,
      dto.module_name,
      dto.score,
      dto.location,
      dto.level,
      dto.waarom_match
    );
  }

  static toDomainList(dtos: RecommendationDto[]): Recommendation[] {
    return dtos.map(this.toDomain);
  }

  static toApplication(recommendation: Recommendation): RecommendationDto {
    return {
      module_id: recommendation.moduleId,
      module_name: recommendation.moduleName,
      score: recommendation.score,
      location: recommendation.location,
      level: recommendation.level,
      waarom_match: recommendation.reason,
    };
  }

  static toApplicationList(
    recommendations: Recommendation[]
  ): RecommendationDto[] {
    return recommendations.map(this.toApplication);
  }
}
