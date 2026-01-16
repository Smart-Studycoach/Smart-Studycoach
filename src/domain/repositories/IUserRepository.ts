import { User, CreateUserDTO, UserProfileDTO } from "../entities/User";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findProfileById(id: string): Promise<UserProfileDTO | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: CreateUserDTO & { password: string }): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  hasEnrolledInModule(user_id: string, module_id: number): Promise<boolean>;
  addFavoriteModule(user_id: string, module_id: number): Promise<boolean>;
  removeFavoriteModule(user_id: string, module_id: number): Promise<boolean>;
  addEnrolledModule(user_id: string, module_id: number): Promise<boolean>;
  removeEnrolledModule(user_id: string, module_id: number): Promise<boolean>;
  hasFavoritedModule(user_id: string, module_id: number): Promise<boolean>;
  getFavoriteModules(user_id: string): Promise<number[]>;
  updateStudentProfile(user_id: string, studentProfile: string): Promise<boolean>;
}
