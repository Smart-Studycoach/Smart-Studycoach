"use server";

import { recommendationService } from "@/infrastructure/container";
import { RecommendationDto } from "@/src/application/dto/RecommendationDto";
import { RecommendationMapper } from "@/infrastructure/mappers/RecommendationMapper";

export async function submitRecommendation(
  _: RecommendationDto[] | null,
  formData: FormData
): Promise<RecommendationDto[]> {
  const interests = formData.get("interests")?.toString() ?? "";
  let level = formData.get("level")?.toString();
  if (level === undefined) level = "";

  const recommendations = await recommendationService.RecommendCourses(
    interests,
    level
  );

  return RecommendationMapper.toApplicationList(recommendations);
}
