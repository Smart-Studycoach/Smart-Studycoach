import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/infrastructure/utils/requireAuth";
import { userService } from "@/infrastructure/container";
import { moduleService } from "@/infrastructure/container";
import { UserProfileInfo } from "@/domain";

export async function GET(request: NextRequest) {
  const auth = requireAuth(request);
  if (auth instanceof NextResponse) return auth;

  const profile = await userService.getUserProfile(auth.userId);
  if (!profile)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: UserProfileInfo = {
    _id: profile._id,
    name: profile.name,
    student_profile: profile.student_profile,
  };

  if (profile.chosen_modules?.length) {
    const chosenModules = await moduleService.getModulesByModule_Ids(
      profile.chosen_modules
    );
    if (chosenModules) {
      data.chosen_modules = chosenModules;
    }
    // hoe kan je dan hier nog de extra key toevoegen?
  }

  return NextResponse.json(data);
}
