import { AuthApplicationService } from '@/application/services/AuthService';
import { IUserRepository, IAuthService } from '@/domain';

const mockUser = {
  _id: 'user123',
  email: 'test@example.com',
  password: 'hashedPassword123',
  name: 'Test User',
  studentProfile: 'Computer Science',
  favoriteModules: [1, 2],
  chosenModules: [3],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01')
};

describe('AuthApplicationService - register', () => {
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;
  let service: AuthApplicationService;

  beforeEach(() => {
    mockUserRepo = {
      existsByEmail: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    service = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('successfully registers new user', async () => {
    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockAuthService.hashPassword.mockResolvedValue('hashedPassword');
    mockUserRepo.create.mockResolvedValue(mockUser);
    mockAuthService.generateToken.mockReturnValue('token123');

    const result = await service.register({
      email: 'new@example.com',
      password: 'password123',
      name: 'New User',
      studentProfile: 'Engineering'
    });

    expect(mockUserRepo.existsByEmail).toHaveBeenCalledWith('new@example.com');
    expect(mockAuthService.hashPassword).toHaveBeenCalledWith('password123');
    expect(result.token).toBe('token123');
    expect(result.user.email).toBe('test@example.com');
    expect(result.user).not.toHaveProperty('password');
  });

  test('throws error when email already exists', async () => {
    mockUserRepo.existsByEmail.mockResolvedValue(true);

    await expect(
      service.register({
        email: 'existing@example.com',
        password: 'password',
        name: 'User',
        studentProfile: 'CS'
      })
    ).rejects.toThrow('User with this email already exists');

    expect(mockAuthService.hashPassword).not.toHaveBeenCalled();
  });

  test('hashes password before storing', async () => {
    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockAuthService.hashPassword.mockResolvedValue('hashed_abc123');
    mockUserRepo.create.mockResolvedValue(mockUser);
    mockAuthService.generateToken.mockReturnValue('token');

    await service.register({
      email: 'test@example.com',
      password: 'plainPassword',
      name: 'User',
      studentProfile: 'Math'
    });

    expect(mockAuthService.hashPassword).toHaveBeenCalledWith('plainPassword');
    expect(mockUserRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ password: 'hashed_abc123' })
    );
  });
});

describe('AuthApplicationService - login', () => {
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;
  let service: AuthApplicationService;

  beforeEach(() => {
    mockUserRepo = {
      existsByEmail: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    service = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('successfully logs in with valid credentials', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(mockUser);
    mockAuthService.comparePasswords.mockResolvedValue(true);
    mockAuthService.generateToken.mockReturnValue('loginToken');

    const result = await service.login({
      email: 'test@example.com',
      password: 'correctPassword'
    });

    expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('test@example.com');
    expect(mockAuthService.comparePasswords).toHaveBeenCalledWith('correctPassword', 'hashedPassword123');
    expect(result.token).toBe('loginToken');
    expect(result.user).not.toHaveProperty('password');
  });

  test('throws error when user not found', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(
      service.login({ email: 'nonexistent@example.com', password: 'password' })
    ).rejects.toThrow('Invalid email or password');

    expect(mockAuthService.comparePasswords).not.toHaveBeenCalled();
  });

  test('throws error when password is incorrect', async () => {
    mockUserRepo.findByEmail.mockResolvedValue(mockUser);
    mockAuthService.comparePasswords.mockResolvedValue(false);

    await expect(
      service.login({ email: 'test@example.com', password: 'wrongPassword' })
    ).rejects.toThrow('Invalid email or password');

    expect(mockAuthService.generateToken).not.toHaveBeenCalled();
  });
});

describe('AuthApplicationService - getCurrentUser', () => {
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;
  let service: AuthApplicationService;

  beforeEach(() => {
    mockUserRepo = {
      existsByEmail: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    service = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('returns user without password', async () => {
    mockUserRepo.findById.mockResolvedValue(mockUser);

    const result = await service.getCurrentUser('user123');

    expect(result).not.toBeNull();
    expect(result).not.toHaveProperty('password');
    expect(result?.email).toBe('test@example.com');
  });

  test('returns null when user not found', async () => {
    mockUserRepo.findById.mockResolvedValue(null);

    const result = await service.getCurrentUser('nonexistent');

    expect(result).toBeNull();
  });
});

describe('AuthApplicationService - updateUser', () => {
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;
  let service: AuthApplicationService;

  beforeEach(() => {
    mockUserRepo = {
      existsByEmail: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    service = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('updates user name', async () => {
    const updatedUser = { ...mockUser, name: 'Updated Name' };
    mockUserRepo.findById.mockResolvedValue(mockUser);
    mockUserRepo.update.mockResolvedValue(updatedUser);

    const result = await service.updateUser('user123', { name: 'Updated Name' });

    expect(result?.name).toBe('Updated Name');
  });

  test('updates user email when not taken', async () => {
    const updatedUser = { ...mockUser, email: 'newemail@example.com' };
    mockUserRepo.findById.mockResolvedValue(mockUser);
    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockUserRepo.update.mockResolvedValue(updatedUser);

    const result = await service.updateUser('user123', { email: 'newemail@example.com' });

    expect(result?.email).toBe('newemail@example.com');
  });

  test('throws error when new email already exists', async () => {
    mockUserRepo.findById.mockResolvedValue(mockUser);
    mockUserRepo.existsByEmail.mockResolvedValue(true);

    await expect(
      service.updateUser('user123', { email: 'taken@example.com' })
    ).rejects.toThrow('Email is already in use');
  });

  test('returns null when user not found', async () => {
    mockUserRepo.findById.mockResolvedValue(null);

    const result = await service.updateUser('nonexistent', { name: 'Test' });

    expect(result).toBeNull();
  });

  test('allows updating to same email (case insensitive)', async () => {
    const userWithUpperEmail = { ...mockUser, email: 'test@example.com' };
    mockUserRepo.findById.mockResolvedValue(userWithUpperEmail);
    mockUserRepo.existsByEmail.mockResolvedValue(true);
    mockUserRepo.update.mockResolvedValue({ ...userWithUpperEmail, email: 'TEST@EXAMPLE.COM' });

    // Updating to the same email but different case should succeed
    const result = await service.updateUser('user123', { email: 'TEST@EXAMPLE.COM' });

    expect(result).not.toBeNull();
    expect(mockUserRepo.update).toHaveBeenCalled();
  });
});

describe('AuthApplicationService - updatePassword', () => {
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;
  let service: AuthApplicationService;

  beforeEach(() => {
    mockUserRepo = {
      existsByEmail: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    service = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('successfully updates password', async () => {
    mockUserRepo.findById.mockResolvedValue(mockUser);
    mockAuthService.comparePasswords.mockResolvedValue(true);
    mockAuthService.hashPassword.mockResolvedValue('newHashedPassword');

    await service.updatePassword('user123', 'oldPassword', 'newPassword');

    expect(mockAuthService.comparePasswords).toHaveBeenCalledWith('oldPassword', 'hashedPassword123');
    expect(mockAuthService.hashPassword).toHaveBeenCalledWith('newPassword');
    expect(mockUserRepo.update).toHaveBeenCalled();
  });

  test('throws error when user not found', async () => {
    mockUserRepo.findById.mockResolvedValue(null);

    await expect(
      service.updatePassword('nonexistent', 'old', 'new')
    ).rejects.toThrow('User not found');
  });

  test('throws error when old password incorrect', async () => {
    mockUserRepo.findById.mockResolvedValue(mockUser);
    mockAuthService.comparePasswords.mockResolvedValue(false);

    await expect(
      service.updatePassword('user123', 'wrongOld', 'new')
    ).rejects.toThrow('Current password is incorrect');

    expect(mockAuthService.hashPassword).not.toHaveBeenCalled();
  });
});

describe('AuthApplicationService - deleteUser', () => {
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;
  let service: AuthApplicationService;

  beforeEach(() => {
    mockUserRepo = {
      existsByEmail: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    service = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('successfully deletes user', async () => {
    mockUserRepo.delete.mockResolvedValue(true);

    const result = await service.deleteUser('user123');

    expect(mockUserRepo.delete).toHaveBeenCalledWith('user123');
    expect(result).toBe(true);
  });

  test('returns false when user not found', async () => {
    mockUserRepo.delete.mockResolvedValue(false);

    const result = await service.deleteUser('nonexistent');

    expect(result).toBe(false);
  });
});
