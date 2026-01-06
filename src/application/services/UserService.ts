import { IUserRepository } from "@/domain";

export class UserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async toggleFavoriteModule(
    userId: string,
    module_id: number,
    favorite: boolean
  ): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) return false;

    return favorite
      ? this.userRepository.addFavoriteModule(user, module_id)
      : this.userRepository.removeFavoriteModule(user, module_id);
  }

  async hasFavoriteModule(
    userId: string,
    module_id: number
  ): Promise<boolean> {
    const user = await this.userRepository.findById(userId);
    if (!user) return false;

    return this.userRepository.hasFavoriteModule(user, module_id);
  }

  async getFavoriteModules(userId: string): Promise<number[]> {
    const user = await this.userRepository.findById(userId);
    if (!user) return [];

    return this.userRepository.getFavoriteModules(user);
  }
}