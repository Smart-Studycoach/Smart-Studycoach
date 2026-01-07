import { IUserRepository, User, UserProfileDTO } from "@/domain";

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async hasUserChosenModule(
    userId: string,
    module_id: string
  ): Promise<boolean> {
    const user: User | null = await this.userRepository.findById(userId);
    if (!user) return false;
    return this.userRepository.hasChosenModule(user, module_id);
  }

  async getUserProfile(userId: string): Promise<UserProfileDTO | null> {
    // Use repository projection to avoid fetching sensitive/large fields
    const profile = await this.userRepository.findProfileById(userId);
    return profile;
  }
}
