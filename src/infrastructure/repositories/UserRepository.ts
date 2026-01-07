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
      studentProfile: doc.studentProfile,
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
      studentProfile: userData.studentProfile,
    });
    return this.mapToEntity(doc as IUserDocument);
  }

  async update(user: User): Promise<User> {
    await connectToDatabase();
    const doc = await UserModel.findByIdAndUpdate(
      user._id,
      {
        email: user.email.toLowerCase(),
        name: user.name,
        password: user.password,
        studentProfile: user.studentProfile,
        chosenModules: user.chosenModules,
        favoriteModules: user.favoriteModules,
      },
      { new: true }
    );
    return this.mapToEntity(doc as IUserDocument);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await connectToDatabase();
      const result = await UserModel.deleteOne({ _id: id });
      return result.deletedCount === 1;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  async existsByEmail(email: string): Promise<boolean> {
    await connectToDatabase();
    const count = await UserModel.countDocuments({
      email: email.toLowerCase(),
    });
    return count > 0;
  }

  async hasChosenModule(user: User, module_id: string): Promise<boolean> {
    await connectToDatabase();
    const parsedId = Number.parseInt(module_id, 10);
    const doc = await UserModel.findOne({
      _id: user._id,
      chosenModules: parsedId,
    });
    return doc !== null;
  }
}
