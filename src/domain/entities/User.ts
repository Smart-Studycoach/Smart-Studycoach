import { ModuleMinimal, mongoDB_id } from "@/domain";

export interface User {
  _id: string;
  email: string;
  password: string;
  name: string;
  studentProfile: string;
  favoriteModules?: string[];
  chosenModules?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  name: string;
  studentProfile: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, "password">;
  token: string;
}

export interface UserProfileDTO {
  _id: string;
  name: string;
  student_profile: string;
  favorite_modules?: mongoDB_id[];
  chosen_modules?: mongoDB_id[];
}

export interface UserProfileInfo {
  _id: string;
  name: string;
  student_profile: string;
  favorite_modules?: ModuleMinimal[];
  chosen_modules?: ModuleMinimal[];
}
