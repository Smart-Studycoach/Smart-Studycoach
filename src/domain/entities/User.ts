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
  studentProfile: string;
  favoriteModules?: string[];
  chosenModules?: string[];
}
