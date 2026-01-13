import { AuthApplicationService } from '@/application/services/AuthService';
import { UserService } from '@/application/services/UserService';
import { ModuleService } from '@/application/services/ModuleService';
import { IUserRepository, IAuthService, IModuleRepository, User, Module } from '@/domain';

/**
 * Integration/Flow tests for complete user journeys
 * Tests end-to-end scenarios involving multiple services
 */

const createMockUser = (id: string = 'user-flow-123'): User => ({
  _id: id,
  email: 'flowtest@example.com',
  password: 'hashedPassword',
  name: 'Flow Test User',
  studentProfile: 'Computer Science',
  favoriteModules: [],
  chosenModules: [],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01')
});

const createMockModule = (id: number = 165): Module => ({
  _id: `module-${id}`,
  module_id: id,
  name: `Test Module ${id}`,
  shortdescription: ['Test description'],
  description: 'Full description',
  studycredit: 5,
  location: ['Campus A'],
  level: 'Beginner',
  learningoutcomes: 'Learn things',
  estimated_difficulty: 3,
  available_spots: 30,
  start_date: '2026-09-01'
});

describe('Flow Tests - User Registration and Login', () => {
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;
  let authService: AuthApplicationService;

  beforeEach(() => {
    mockUserRepo = {
      existsByEmail: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addFavoriteModule: jest.fn(),
      removeFavoriteModule: jest.fn(),
      hasFavoritedModule: jest.fn(),
      getFavoriteModules: jest.fn(),
      addEnrolledModule: jest.fn(),
      removeEnrolledModule: jest.fn(),
      hasEnrolledInModule: jest.fn(),
      findProfileById: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    authService = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  describe('Complete registration flow', () => {
    test('new user can register successfully', async () => {
      // Setup
      const newUser = createMockUser();
      mockUserRepo.existsByEmail.mockResolvedValue(false);
      mockAuthService.hashPassword.mockResolvedValue('hashedPassword123');
      mockUserRepo.create.mockResolvedValue(newUser);
      mockAuthService.generateToken.mockReturnValue('jwt-token-abc123');

      // Execute registration
      const result = await authService.register({
        email: 'newuser@example.com',
        password: 'SecurePass123',
        name: 'New User',
        studentProfile: 'Engineering'
      });

      // Verify complete flow
      expect(mockUserRepo.existsByEmail).toHaveBeenCalledWith('newuser@example.com');
      expect(mockAuthService.hashPassword).toHaveBeenCalledWith('SecurePass123');
      expect(mockUserRepo.create).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        password: 'hashedPassword123',
        name: 'New User',
        studentProfile: 'Engineering'
      });
      expect(result.token).toBe('jwt-token-abc123');
      expect(result.user).not.toHaveProperty('password');
      expect(result.user.email).toBe('flowtest@example.com');
    });

    test('registration fails when email already exists', async () => {
      mockUserRepo.existsByEmail.mockResolvedValue(true);

      await expect(
        authService.register({
          email: 'existing@example.com',
          password: 'password',
          name: 'User',
          studentProfile: 'CS'
        })
      ).rejects.toThrow('User with this email already exists');

      // Verify flow stopped at email check
      expect(mockAuthService.hashPassword).not.toHaveBeenCalled();
      expect(mockUserRepo.create).not.toHaveBeenCalled();
    });
  });

  describe('Complete login flow', () => {
    test('registered user can login successfully', async () => {
      const user = createMockUser();
      mockUserRepo.findByEmail.mockResolvedValue(user);
      mockAuthService.comparePasswords.mockResolvedValue(true);
      mockAuthService.generateToken.mockReturnValue('login-token-xyz');

      // Execute login
      const result = await authService.login({
        email: 'flowtest@example.com',
        password: 'CorrectPassword'
      });

      // Verify complete flow
      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith('flowtest@example.com');
      expect(mockAuthService.comparePasswords).toHaveBeenCalledWith('CorrectPassword', 'hashedPassword');
      expect(mockAuthService.generateToken).toHaveBeenCalledWith('user-flow-123');
      expect(result.token).toBe('login-token-xyz');
      expect(result.user).not.toHaveProperty('password');
    });

    test('login fails with wrong password', async () => {
      const user = createMockUser();
      mockUserRepo.findByEmail.mockResolvedValue(user);
      mockAuthService.comparePasswords.mockResolvedValue(false);

      await expect(
        authService.login({
          email: 'flowtest@example.com',
          password: 'WrongPassword'
        })
      ).rejects.toThrow('Invalid email or password');

      // Verify token was not generated
      expect(mockAuthService.generateToken).not.toHaveBeenCalled();
    });

    test('login fails with non-existent email', async () => {
      mockUserRepo.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'nonexistent@example.com',
          password: 'password'
        })
      ).rejects.toThrow('Invalid email or password');

      expect(mockAuthService.comparePasswords).not.toHaveBeenCalled();
    });
  });

  describe('Register → Login flow', () => {
    test('user can register and immediately login', async () => {
      const newUser = createMockUser();
      
      // Step 1: Register
      mockUserRepo.existsByEmail.mockResolvedValue(false);
      mockAuthService.hashPassword.mockResolvedValue('hashedPass');
      mockUserRepo.create.mockResolvedValue(newUser);
      mockAuthService.generateToken.mockReturnValue('register-token');

      const registerResult = await authService.register({
        email: 'newuser@example.com',
        password: 'MyPass123',
        name: 'Test User',
        studentProfile: 'Math'
      });

      expect(registerResult.token).toBe('register-token');
      
      // Step 2: Login with same credentials
      mockUserRepo.findByEmail.mockResolvedValue(newUser);
      mockAuthService.comparePasswords.mockResolvedValue(true);
      mockAuthService.generateToken.mockReturnValue('login-token');

      const loginResult = await authService.login({
        email: 'newuser@example.com',
        password: 'MyPass123'
      });

      expect(loginResult.token).toBe('login-token');
      expect(loginResult.user._id).toBe(registerResult.user._id);
    });
  });
});

describe('Flow Tests - Module Enrollment', () => {
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockModuleRepo: jest.Mocked<IModuleRepository>;
  let userService: UserService;
  let moduleService: ModuleService;

  beforeEach(() => {
    mockUserRepo = {
      existsByEmail: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addFavoriteModule: jest.fn(),
      removeFavoriteModule: jest.fn(),
      hasFavoritedModule: jest.fn(),
      getFavoriteModules: jest.fn(),
      addEnrolledModule: jest.fn(),
      removeEnrolledModule: jest.fn(),
      hasEnrolledInModule: jest.fn(),
      findProfileById: jest.fn()
    } as any;

    mockModuleRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findMinimalsByIds: jest.fn()
    } as any;

    userService = new UserService(mockUserRepo, mockModuleRepo);
    moduleService = new ModuleService(mockModuleRepo);
  });

  describe('Enroll in module flow', () => {
    test('user can enroll in an available module', async () => {
      const module = createMockModule(165);
      mockModuleRepo.findById.mockResolvedValue(module);
      mockUserRepo.addEnrolledModule.mockResolvedValue(true);
      mockUserRepo.hasEnrolledInModule.mockResolvedValue(false).mockResolvedValueOnce(false);

      // Step 1: Check module exists
      const moduleExists = await moduleService.getModuleById('165');
      expect(moduleExists).not.toBeNull();
      expect(moduleExists?.module_id).toBe(165);

      // Step 2: Check user not already enrolled
      const alreadyEnrolled = await userService.hasEnrolledInModule('user-123', 165);
      expect(alreadyEnrolled).toBe(false);

      // Step 3: Enroll user
      const success = await userService.toggleEnrolledModule('user-123', 165, true);
      expect(success).toBe(true);
      expect(mockUserRepo.addEnrolledModule).toHaveBeenCalledWith('user-123', 165);
    });

    test('user can unenroll from enrolled module', async () => {
      mockUserRepo.hasEnrolledInModule.mockResolvedValue(true);
      mockUserRepo.removeEnrolledModule.mockResolvedValue(true);

      // Step 1: Verify user is enrolled
      const isEnrolled = await userService.hasEnrolledInModule('user-123', 165);
      expect(isEnrolled).toBe(true);

      // Step 2: Unenroll user
      const success = await userService.toggleEnrolledModule('user-123', 165, false);
      expect(success).toBe(true);
      expect(mockUserRepo.removeEnrolledModule).toHaveBeenCalledWith('user-123', 165);
    });
  });

  describe('Complete enrollment lifecycle', () => {
    test('user can enroll → check status → unenroll', async () => {
      const userId = 'user-lifecycle-123';
      const moduleId = 165;

      // Start: User not enrolled
      mockUserRepo.hasEnrolledInModule.mockResolvedValue(false);
      let enrolled = await userService.hasEnrolledInModule(userId, moduleId);
      expect(enrolled).toBe(false);

      // Action 1: Enroll
      mockUserRepo.addEnrolledModule.mockResolvedValue(true);
      const enrollSuccess = await userService.toggleEnrolledModule(userId, moduleId, true);
      expect(enrollSuccess).toBe(true);

      // Check: User is now enrolled
      mockUserRepo.hasEnrolledInModule.mockResolvedValue(true);
      enrolled = await userService.hasEnrolledInModule(userId, moduleId);
      expect(enrolled).toBe(true);

      // Action 2: Unenroll
      mockUserRepo.removeEnrolledModule.mockResolvedValue(true);
      const unenrollSuccess = await userService.toggleEnrolledModule(userId, moduleId, false);
      expect(unenrollSuccess).toBe(true);

      // End: User not enrolled anymore
      mockUserRepo.hasEnrolledInModule.mockResolvedValue(false);
      enrolled = await userService.hasEnrolledInModule(userId, moduleId);
      expect(enrolled).toBe(false);
    });

    test('user can enroll in multiple modules sequentially', async () => {
      const userId = 'user-multi-123';
      const moduleIds = [165, 166, 167];

      mockUserRepo.addEnrolledModule.mockResolvedValue(true);

      // Enroll in three modules
      for (const moduleId of moduleIds) {
        const success = await userService.toggleEnrolledModule(userId, moduleId, true);
        expect(success).toBe(true);
      }

      expect(mockUserRepo.addEnrolledModule).toHaveBeenCalledTimes(3);
      expect(mockUserRepo.addEnrolledModule).toHaveBeenNthCalledWith(1, userId, 165);
      expect(mockUserRepo.addEnrolledModule).toHaveBeenNthCalledWith(2, userId, 166);
      expect(mockUserRepo.addEnrolledModule).toHaveBeenNthCalledWith(3, userId, 167);
    });
  });
});

describe('Flow Tests - Module Favorites', () => {
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockModuleRepo: jest.Mocked<IModuleRepository>;
  let userService: UserService;

  beforeEach(() => {
    mockUserRepo = {
      existsByEmail: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addFavoriteModule: jest.fn(),
      removeFavoriteModule: jest.fn(),
      hasFavoritedModule: jest.fn(),
      getFavoriteModules: jest.fn(),
      addEnrolledModule: jest.fn(),
      removeEnrolledModule: jest.fn(),
      hasEnrolledInModule: jest.fn(),
      findProfileById: jest.fn()
    } as any;

    mockModuleRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findMinimalsByIds: jest.fn()
    } as any;

    userService = new UserService(mockUserRepo, mockModuleRepo);
  });

  describe('Favorite module flow', () => {
    test('user can favorite a module', async () => {
      mockUserRepo.hasFavoritedModule.mockResolvedValue(false);
      mockUserRepo.addFavoriteModule.mockResolvedValue(true);

      // Step 1: Check not favorited
      const isFavorited = await userService.hasFavoritedModule('user-123', 165);
      expect(isFavorited).toBe(false);

      // Step 2: Add to favorites
      const success = await userService.toggleFavoriteModule('user-123', 165, true);
      expect(success).toBe(true);
      expect(mockUserRepo.addFavoriteModule).toHaveBeenCalledWith('user-123', 165);
    });

    test('user can unfavorite a module', async () => {
      mockUserRepo.hasFavoritedModule.mockResolvedValue(true);
      mockUserRepo.removeFavoriteModule.mockResolvedValue(true);

      // Step 1: Check is favorited
      const isFavorited = await userService.hasFavoritedModule('user-123', 165);
      expect(isFavorited).toBe(true);

      // Step 2: Remove from favorites
      const success = await userService.toggleFavoriteModule('user-123', 165, false);
      expect(success).toBe(true);
      expect(mockUserRepo.removeFavoriteModule).toHaveBeenCalledWith('user-123', 165);
    });
  });

  describe('Complete favorite lifecycle', () => {
    test('user can favorite → check status → unfavorite', async () => {
      const userId = 'user-fav-123';
      const moduleId = 170;

      // Start: Not favorited
      mockUserRepo.hasFavoritedModule.mockResolvedValue(false);
      let favorited = await userService.hasFavoritedModule(userId, moduleId);
      expect(favorited).toBe(false);

      // Action 1: Favorite
      mockUserRepo.addFavoriteModule.mockResolvedValue(true);
      const favSuccess = await userService.toggleFavoriteModule(userId, moduleId, true);
      expect(favSuccess).toBe(true);

      // Check: Now favorited
      mockUserRepo.hasFavoritedModule.mockResolvedValue(true);
      favorited = await userService.hasFavoritedModule(userId, moduleId);
      expect(favorited).toBe(true);

      // Action 2: Unfavorite
      mockUserRepo.removeFavoriteModule.mockResolvedValue(true);
      const unfavSuccess = await userService.toggleFavoriteModule(userId, moduleId, false);
      expect(unfavSuccess).toBe(true);

      // End: Not favorited anymore
      mockUserRepo.hasFavoritedModule.mockResolvedValue(false);
      favorited = await userService.hasFavoritedModule(userId, moduleId);
      expect(favorited).toBe(false);
    });

    test('user can manage multiple favorites', async () => {
      const userId = 'user-multi-fav';
      
      // Favorite three modules
      mockUserRepo.addFavoriteModule.mockResolvedValue(true);
      await userService.toggleFavoriteModule(userId, 165, true);
      await userService.toggleFavoriteModule(userId, 166, true);
      await userService.toggleFavoriteModule(userId, 167, true);

      // Get all favorites
      mockUserRepo.getFavoriteModules.mockResolvedValue([165, 166, 167]);
      const favorites = await userService.getFavoriteModules(userId);
      expect(favorites).toEqual([165, 166, 167]);

      // Unfavorite one
      mockUserRepo.removeFavoriteModule.mockResolvedValue(true);
      await userService.toggleFavoriteModule(userId, 166, false);

      // Check updated list
      mockUserRepo.getFavoriteModules.mockResolvedValue([165, 167]);
      const updatedFavorites = await userService.getFavoriteModules(userId);
      expect(updatedFavorites).toEqual([165, 167]);
    });
  });
});

describe('Flow Tests - Combined Scenarios', () => {
  let mockUserRepo: jest.Mocked<IUserRepository>;
  let mockModuleRepo: jest.Mocked<IModuleRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;
  let authService: AuthApplicationService;
  let userService: UserService;

  beforeEach(() => {
    mockUserRepo = {
      existsByEmail: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addFavoriteModule: jest.fn(),
      removeFavoriteModule: jest.fn(),
      hasFavoritedModule: jest.fn(),
      getFavoriteModules: jest.fn(),
      addEnrolledModule: jest.fn(),
      removeEnrolledModule: jest.fn(),
      hasEnrolledInModule: jest.fn(),
      findProfileById: jest.fn()
    } as any;

    mockModuleRepo = {
      findAll: jest.fn(),
      findById: jest.fn(),
      findMinimalsByIds: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    authService = new AuthApplicationService(mockUserRepo, mockAuthService);
    userService = new UserService(mockUserRepo, mockModuleRepo);
  });

  test('Complete user journey: Register → Login → Favorite → Enroll', async () => {
    const newUser = createMockUser('journey-user-123');
    const moduleId = 165;

    // Step 1: Register
    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockAuthService.hashPassword.mockResolvedValue('hashed');
    mockUserRepo.create.mockResolvedValue(newUser);
    mockAuthService.generateToken.mockReturnValue('token-1');

    const registerResult = await authService.register({
      email: 'journey@example.com',
      password: 'Pass123',
      name: 'Journey User',
      studentProfile: 'CS'
    });
    expect(registerResult.token).toBe('token-1');

    // Step 2: Login
    mockUserRepo.findByEmail.mockResolvedValue(newUser);
    mockAuthService.comparePasswords.mockResolvedValue(true);
    mockAuthService.generateToken.mockReturnValue('token-2');

    const loginResult = await authService.login({
      email: 'journey@example.com',
      password: 'Pass123'
    });
    expect(loginResult.token).toBe('token-2');
    const userId = loginResult.user._id;

    // Step 3: Favorite a module
    mockUserRepo.addFavoriteModule.mockResolvedValue(true);
    const favoriteSuccess = await userService.toggleFavoriteModule(userId, moduleId, true);
    expect(favoriteSuccess).toBe(true);

    // Step 4: Enroll in the same module
    mockUserRepo.addEnrolledModule.mockResolvedValue(true);
    const enrollSuccess = await userService.toggleEnrolledModule(userId, moduleId, true);
    expect(enrollSuccess).toBe(true);

    // Verify final state
    mockUserRepo.hasFavoritedModule.mockResolvedValue(true);
    mockUserRepo.hasEnrolledInModule.mockResolvedValue(true);

    const isFavorited = await userService.hasFavoritedModule(userId, moduleId);
    const isEnrolled = await userService.hasEnrolledInModule(userId, moduleId);

    expect(isFavorited).toBe(true);
    expect(isEnrolled).toBe(true);
  });

  test('User can favorite without enrolling', async () => {
    const userId = 'user-fav-only';
    const moduleId = 170;

    // Favorite module
    mockUserRepo.addFavoriteModule.mockResolvedValue(true);
    await userService.toggleFavoriteModule(userId, moduleId, true);

    // Verify state
    mockUserRepo.hasFavoritedModule.mockResolvedValue(true);
    mockUserRepo.hasEnrolledInModule.mockResolvedValue(false);

    const isFavorited = await userService.hasFavoritedModule(userId, moduleId);
    const isEnrolled = await userService.hasEnrolledInModule(userId, moduleId);

    expect(isFavorited).toBe(true);
    expect(isEnrolled).toBe(false);
  });

  test('User can enroll without favoriting', async () => {
    const userId = 'user-enroll-only';
    const moduleId = 175;

    // Enroll in module
    mockUserRepo.addEnrolledModule.mockResolvedValue(true);
    await userService.toggleEnrolledModule(userId, moduleId, true);

    // Verify state
    mockUserRepo.hasFavoritedModule.mockResolvedValue(false);
    mockUserRepo.hasEnrolledInModule.mockResolvedValue(true);

    const isFavorited = await userService.hasFavoritedModule(userId, moduleId);
    const isEnrolled = await userService.hasEnrolledInModule(userId, moduleId);

    expect(isFavorited).toBe(false);
    expect(isEnrolled).toBe(true);
  });

  test('User can cleanup: Unfavorite and Unenroll', async () => {
    const userId = 'user-cleanup';
    const moduleId = 180;

    // Setup: User has favorited and enrolled
    mockUserRepo.hasFavoritedModule.mockResolvedValue(true);
    mockUserRepo.hasEnrolledInModule.mockResolvedValue(true);

    // Action 1: Unfavorite
    mockUserRepo.removeFavoriteModule.mockResolvedValue(true);
    await userService.toggleFavoriteModule(userId, moduleId, false);

    // Action 2: Unenroll
    mockUserRepo.removeEnrolledModule.mockResolvedValue(true);
    await userService.toggleEnrolledModule(userId, moduleId, false);

    // Verify cleanup complete
    mockUserRepo.hasFavoritedModule.mockResolvedValue(false);
    mockUserRepo.hasEnrolledInModule.mockResolvedValue(false);

    const isFavorited = await userService.hasFavoritedModule(userId, moduleId);
    const isEnrolled = await userService.hasEnrolledInModule(userId, moduleId);

    expect(isFavorited).toBe(false);
    expect(isEnrolled).toBe(false);
  });
});
