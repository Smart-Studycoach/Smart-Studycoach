import { User, CreateUserDTO } from "../entities/User";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: CreateUserDTO & { password: string }): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<boolean>;
  existsByEmail(email: string): Promise<boolean>;
  hasChosenModule(user: User, module_id: string): Promise<boolean>;
}
