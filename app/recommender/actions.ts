"use server";

import { recommendationService } from "@/infrastructure/container";
import { RecommendationDto } from "@/application/dto/RecommendationDto";
import { RecommendationMapper } from "@/infrastructure/mappers/RecommendationMapper";

type RecommendationResult =
  | { success: true; data: RecommendationDto[] }
  | { success: false; error: string; errorDetails?: { status?: number; body?: string } };

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
    
    // Check if error has HttpError properties
    if (error && typeof error === 'object' && 'body' in error && 'status' in error) {
      const httpError = error as { message: string; status: number; body?: string };
      
      // Try to parse the body for a detailed message
      let detailMessage = httpError.message;
      if (httpError.body) {
        try {
          const bodyData = JSON.parse(httpError.body);
          if (bodyData.detail) {
            detailMessage = bodyData.detail;
          }
        } catch {
          // If parsing fails, use the original message
        }
      }
      
      return {
        success: false,
        error: detailMessage,
        errorDetails: {
          status: httpError.status,
          body: httpError.body,
        },
      };
    }
    
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Er is iets misgegaan bij het ophalen van aanbevelingen. Probeer het opnieuw.",
    };
  }
}
