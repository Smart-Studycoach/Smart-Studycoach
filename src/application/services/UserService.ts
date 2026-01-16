import { IModuleRepository, IUserRepository, UserProfileDTO } from "@/domain";

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly moduleRepository: IModuleRepository
  ) {}

  async toggleFavoriteModule(
    userId: string,
    module_id: number,
    favorite: boolean
  ): Promise<boolean> {
    return favorite
      ? this.userRepository.addFavoriteModule(userId, module_id)
      : this.userRepository.removeFavoriteModule(userId, module_id);
  }

  async hasFavoritedModule(
    userId: string,
    module_id: number
  ): Promise<boolean> {
    return this.userRepository.hasFavoritedModule(userId, module_id);
  }

  async getFavoriteModules(userId: string): Promise<number[]> {
    return this.userRepository.getFavoriteModules(userId);
  }

  async hasEnrolledInModule(
    userId: string,
    module_id: number
  ): Promise<boolean> {
    return this.userRepository.hasEnrolledInModule(userId, module_id);
  }

  async getUserProfile(userId: string): Promise<UserProfileDTO | null> {
    const profile = await this.userRepository.findProfileById(userId);
    return profile;
  }

  async toggleEnrolledModule(
    user_id: string,
    module_id: number,
    chosen: boolean
  ): Promise<boolean> {
    return chosen
      ? this.userRepository.addEnrolledModule(user_id, module_id)
      : this.userRepository.removeEnrolledModule(user_id, module_id);
  }

  async updateStudentProfile(
    user_id: string,
    studentProfile: string
  ): Promise<boolean> {
    return this.userRepository.updateStudentProfile(user_id, studentProfile);
  }
}
