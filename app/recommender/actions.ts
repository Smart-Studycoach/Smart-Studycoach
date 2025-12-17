"use server";

import { recommendationService } from "@/infrastructure/container";
import { RecommendationDto } from "@/infrastructure/dto/RecommendationDTO";

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

  // nog een mapper maken voor het reverse?
  return recommendations.map((r) => ({
    module_id: r.moduleId,
    module_name: r.moduleName,
    score: r.score,
    location: r.location,
    level: r.level,
    waarom_match: r.reason,
  }));
}
