"use server";

import { recommendationService } from "@/infrastructure/container";
import { RecommendationDto } from "@/application/dto/RecommendationDto";
import { RecommendationMapper } from "@/infrastructure/mappers/RecommendationMapper";

export async function submitRecommendation(
  _: RecommendationDto[] | null,
  formData: FormData
): Promise<RecommendationDto[]> {
  const interests = formData.get("interests")?.toString()?.trim() ?? "";
  const level = formData.get("level")?.toString() ?? "";
  const location = formData.get("location")?.toString() ?? "";
  const k = 3; // Number of recommendations to return

  // Backend validation
  if (interests.length < 10) {
    throw new Error("Interests must contain at least 10 characters");
  }

  const recommendations = await recommendationService.RecommendCourses(
    interests,
    level,
    location,
    k
  );

  return RecommendationMapper.toApplicationList(recommendations);
}
