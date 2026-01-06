import { User, CreateUserDTO } from "../entities/User";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: CreateUserDTO & { password: string }): Promise<User>;
  delete(id: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  hasChosenModule(user: User, module_id: string): Promise<boolean>;
  addFavoriteModule(user: User, module_id: number): Promise<boolean>;
  removeFavoriteModule(user: User, module_id: number): Promise<boolean>;
  hasFavoriteModule(user: User, module_id: number): Promise<boolean>;
  getFavoriteModules(user: User): Promise<number[]>;
}
