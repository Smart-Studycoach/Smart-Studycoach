// infrastructure/mappers/RecommendationMapper.ts
import { Recommendation } from "@/domain";
import { RecommendationDto } from "../dto/RecommendationDTO";

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
}
