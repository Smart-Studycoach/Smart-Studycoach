import { Types } from "mongoose";

import { User, CreateUserDTO, IUserRepository, UserProfileDTO } from "@/domain";

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

  async findProfileById(id: string): Promise<UserProfileDTO | null> {
    await connectToDatabase();
    const doc = await UserModel.findById(id).select(
      "name studentProfile favoriteModules chosenModules"
    );
    if (!doc) return null;
    return {
      name: (doc as IUserDocument).name,
      student_profile: (doc as IUserDocument).studentProfile,
      favorite_modules: (doc as IUserDocument).favoriteModules,
      chosen_modules: (doc as IUserDocument).chosenModules,
    };
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

    if (!doc) {
      throw new Error(`User with id ${user._id} not found`);
    }

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

  async hasEnrolledInModule(
    user_id: string,
    module_id: number
  ): Promise<boolean> {
    await connectToDatabase();
    const doc = await UserModel.findOne({
      _id: user_id,
      chosenModules: module_id,
    });
    return doc !== null;
  }

  async addFavoriteModule(
    user_id: string,
    module_id: number
  ): Promise<boolean> {
    console.log("ADD FAVORITE", {
      userId: user_id,
      module_id,
    });

    await connectToDatabase();

    const result = await UserModel.updateOne(
      { _id: new Types.ObjectId(user_id) },
      { $addToSet: { favoriteModules: module_id } }
    );
    console.log("UPDATE RESULT", result);

    return result.modifiedCount > 0;
  }

  async removeFavoriteModule(
    user_id: string,
    module_id: number
  ): Promise<boolean> {
    await connectToDatabase();

    const result = await UserModel.updateOne(
      { _id: user_id },
      { $pull: { favoriteModules: module_id } }
    );

    return result.modifiedCount > 0;
  }

  async hasFavoritedModule(
    user_id: string,
    module_id: number
  ): Promise<boolean> {
    await connectToDatabase();

    const exists = await UserModel.exists({
      _id: user_id,
      favoriteModules: module_id,
    });

    return Boolean(exists);
  }

  async getFavoriteModules(user_id: string): Promise<number[]> {
    await connectToDatabase();

    const foundUser = await UserModel.findById(user_id).select(
      "favoriteModules"
    );
    return foundUser?.favoriteModules ?? [];
  }

  async addEnrolledModule(
    user_id: string,
    module_id: number
  ): Promise<boolean> {
    await connectToDatabase();
    const doc = await UserModel.updateOne(
      { _id: user_id },
      { $addToSet: { chosenModules: module_id } }
    );
    if (!doc) return false;
    return true;
  }

  async removeEnrolledModule(
    user_id: string,
    module_id: number
  ): Promise<boolean> {
    await connectToDatabase();
    const doc = await UserModel.updateOne(
      { _id: user_id },
      { $pull: { chosenModules: module_id } }
    );
    if (!doc) return false;
    return true;
  }
}
