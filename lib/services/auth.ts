import { AuthError } from "@/src/domain/errors/AuthError";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "../types/auth";

const API_BASE_URL = "/api";

class AuthService {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new AuthError(data.error || "Login failed", response.status);
    }

    return data;
  }

  /**
   * Register a new user
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new AuthError(data.error || "Registration failed", response.status);
    }

    return data;
  }

  /**
   * Delete current user account (uses HttpOnly cookie for auth)
   */
  async deleteAccount(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      const data = await response.json();
      throw new AuthError(
        data.error || "Failed to delete account",
        response.status
      );
    }
  }

  /**
   * Get current user from the server (using HttpOnly cookie)
   */
  async getUser(): Promise<User | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error("Failed to get user:", error);
      return null;
    }
  }

  /**
   * Update user (uses HttpOnly cookie for auth)
   */
  async updateUser(user: Partial<User>): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(user),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to update user");
    }

    return data.user;
  }

  /**
   * Update user password (uses HttpOnly cookie for auth)
   */
  async updatePassword(oldPassword: string, newPassword: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to update password");
    }
  }

  /**
   * Clear authentication data (clears HttpOnly cookie)
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Failed to clear auth cookie:", error);
    }
  }

  /**
   * Check if user is authenticated by calling the API
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getUser();
    return user !== null;
  }
}

export const authService = new AuthService();
