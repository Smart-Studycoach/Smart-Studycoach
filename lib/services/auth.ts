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
   * Get current authenticated user
   */
  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new AuthError(data.error || "Failed to get user", response.status);
    }

    return data.user;
  }

  /**
   * Delete current user account
   */
  async deleteAccount(token: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
   * Store authentication data in localStorage
   */
  storeAuth(authResponse: AuthResponse): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", authResponse.token);
      localStorage.setItem("user", JSON.stringify(authResponse.user));
    }
  }

  /**
   * Get stored token
   */
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  }

  /**
   * Get stored user
   */
  getUser(): User | null {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }

  /**
   * Clear authentication data
   */
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
}

export const authService = new AuthService();
