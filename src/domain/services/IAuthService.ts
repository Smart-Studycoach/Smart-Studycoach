export interface IAuthService {
  hashPassword(password: string): Promise<string>;
  comparePasswords(password: string, hashedPassword: string): Promise<boolean>;
  generateToken(userId: string): string;
  verifyToken(token: string): { userId: string } | null;
}
