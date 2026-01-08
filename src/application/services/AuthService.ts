import {
  User,
  CreateUserDTO,
  LoginDTO,
  AuthResponse,
  IUserRepository,
  IAuthService,
  UpdateUserDTO,
} from "@/domain";

export class AuthApplicationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService
  ) {}

  async register(dto: CreateUserDTO): Promise<AuthResponse> {
    const existingUser = await this.userRepository.existsByEmail(dto.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await this.authService.hashPassword(dto.password);
    const user = await this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const token = this.authService.generateToken(user._id);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async login(dto: LoginDTO): Promise<AuthResponse> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValidPassword = await this.authService.comparePasswords(
      dto.password,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    const token = this.authService.generateToken(user._id);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async getCurrentUser(userId: string): Promise<Omit<User, "password"> | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;
    return this.sanitizeUser(user);
  }

  async deleteUser(userId: string): Promise<boolean> {
    return await this.userRepository.delete(userId);
  }

  async updateUser(
    userId: string,
    dto: UpdateUserDTO
  ): Promise<Omit<User, "password"> | null> {
    const user = await this.userRepository.findById(userId);
    if (!user) return null;

    if (dto.email) {
      const emailExists = await this.userRepository.existsByEmail(dto.email);
      if (emailExists && dto.email.toLowerCase() !== user.email.toLowerCase()) {
        throw new Error("Email is already in use");
      }
      user.email = dto.email;
    }

    if (dto.name) {
      user.name = dto.name;
    }
    const updatedUser = await this.userRepository.update(user);
    return this.sanitizeUser(updatedUser);
  }

  async updatePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Verify old password
    const isValidPassword = await this.authService.comparePasswords(
      oldPassword,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("Current password is incorrect");
    }

    // Hash and update new password
    const hashedPassword = await this.authService.hashPassword(newPassword);
    user.password = hashedPassword;
    await this.userRepository.update(user);
  }

  private sanitizeUser(user: User): Omit<User, "password"> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}
