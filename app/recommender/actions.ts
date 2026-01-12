"use server";

import { recommendationService } from "@/infrastructure/container";
import { RecommendationDto } from "@/application/dto/RecommendationDto";
import { RecommendationMapper } from "@/infrastructure/mappers/RecommendationMapper";

type RecommendationResult =
  | { success: true; data: RecommendationDto[] }
  | { success: false; error: string };

export async function submitRecommendation(
  _: RecommendationResult | null,
  formData: FormData
): Promise<RecommendationResult> {
  try {
    const interests = formData.get("interests")?.toString()?.trim() ?? "";
    const level = formData.get("level")?.toString() ?? "";
    const location = formData.get("location")?.toString() ?? "";
    const k = 3;

    // Backend validation
    if (interests.length < 10) {
      return {
        success: false,
        error: "Interesses moeten minimaal 10 karakters bevatten",
      };
    }

    const recommendations = await recommendationService.RecommendCourses(
      interests,
      level,
      location,
      k
    );

    return {
      success: true,
      data: RecommendationMapper.toApplicationList(recommendations),
    };
  } catch (error) {
    console.error("Recommendation error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Er is iets misgegaan bij het ophalen van aanbevelingen. Probeer het opnieuw.",
    };
  }
}
