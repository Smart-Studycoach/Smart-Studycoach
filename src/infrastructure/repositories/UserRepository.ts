import { User, CreateUserDTO, IUserRepository } from "@/domain";
import { connectToDatabase } from "../database/mongodb";
import { UserModel, IUserDocument } from "../database/models/UserModel";

export class UserRepository implements IUserRepository {
  private mapToEntity(doc: IUserDocument): User {
    return {
      _id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      name: doc.name,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  async findById(id: string): Promise<User | null> {
    await connectToDatabase();
    const doc = await UserModel.findById(id);
    return doc ? this.mapToEntity(doc as IUserDocument) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    await connectToDatabase();
    const doc = await UserModel.findOne({ email: email.toLowerCase() });
    return doc ? this.mapToEntity(doc as IUserDocument) : null;
  }

  async create(userData: CreateUserDTO & { password: string }): Promise<User> {
    await connectToDatabase();
    const doc = await UserModel.create({
      email: userData.email.toLowerCase(),
      password: userData.password,
      name: userData.name,
    });
    return this.mapToEntity(doc as IUserDocument);
  }

  async existsByEmail(email: string): Promise<boolean> {
    await connectToDatabase();
    const count = await UserModel.countDocuments({
      email: email.toLowerCase(),
    });
    return count > 0;
  }
}
