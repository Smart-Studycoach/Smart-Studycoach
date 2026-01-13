import { getTokenFromRequest, getUserIdFromRequest } from '@/infrastructure/utils/auth';

jest.mock('@/infrastructure/container', () => ({
  authService: {
    verifyToken: jest.fn()
  }
}));

const { authService } = require('@/infrastructure/container');

function makeRequest({ authorization, cookie }: { authorization?: string; cookie?: any }) {
  return {
    headers: {
      get: (key: string) => (key.toLowerCase() === 'authorization' ? authorization ?? null : null)
    },
    cookies: {
      get: (name: string) => {
        if (name !== 'token') return undefined;
        return cookie;
      }
    }
  } as any;
}

describe('auth utils - getTokenFromRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Bearer token extraction', () => {
    test('extracts token from valid Bearer header', () => {
      const req = makeRequest({ authorization: 'Bearer abc123' });
      expect(getTokenFromRequest(req as any)).toBe('abc123');
    });

    test('extracts token with special characters', () => {
      const req = makeRequest({ authorization: 'Bearer token.with-special_chars' });
      expect(getTokenFromRequest(req as any)).toBe('token.with-special_chars');
    });

    test('extracts long JWT token', () => {
      const longToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      const req = makeRequest({ authorization: `Bearer ${longToken}` });
      expect(getTokenFromRequest(req as any)).toBe(longToken);
    });

    test('returns null for malformed Bearer header (no space)', () => {
      const req = makeRequest({ authorization: 'Bearerabc123' });
      expect(getTokenFromRequest(req as any)).toBeNull();
    });

    test('returns null for Bearer without token', () => {
      const req = makeRequest({ authorization: 'Bearer ' });
      expect(getTokenFromRequest(req as any)).toBe('');
    });

    test('returns null for case-sensitive Bearer (bearer lowercase)', () => {
      const req = makeRequest({ authorization: 'bearer abc123' });
      expect(getTokenFromRequest(req as any)).toBeNull();
    });
  });

  describe('Cookie fallback', () => {
    test('falls back to cookie when header absent (string cookie)', () => {
      const req = makeRequest({ cookie: 'cookieToken' });
      expect(getTokenFromRequest(req as any)).toBe('cookieToken');
    });

    test('falls back to cookie when header absent (object cookie)', () => {
      const req = makeRequest({ cookie: { value: 'cookieObjToken' } });
      expect(getTokenFromRequest(req as any)).toBe('cookieObjToken');
    });

    test('prefers Authorization header over cookie', () => {
      const req = makeRequest({ authorization: 'Bearer headerToken', cookie: 'cookieToken' });
      expect(getTokenFromRequest(req as any)).toBe('headerToken');
    });

    test('returns null when both header and cookie absent', () => {
      const req = makeRequest({});
      expect(getTokenFromRequest(req as any)).toBeNull();
    });

    test('handles undefined cookie gracefully', () => {
      const req = makeRequest({ cookie: undefined });
      expect(getTokenFromRequest(req as any)).toBeNull();
    });
  });

  describe('Edge cases', () => {
    test('handles empty authorization header', () => {
      const req = makeRequest({ authorization: '' });
      expect(getTokenFromRequest(req as any)).toBeNull();
    });

    test('handles null authorization header', () => {
      const req = makeRequest({ authorization: null as any });
      expect(getTokenFromRequest(req as any)).toBeNull();
    });
  });
});

describe('auth utils - getUserIdFromRequest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('No token scenarios', () => {
    test('returns no-token error when token absent', () => {
      const req = makeRequest({});
      expect(getUserIdFromRequest(req as any)).toEqual({ error: 'no-token' });
    });

    test('returns no-token error when token is empty string', () => {
      const req = makeRequest({ authorization: 'Bearer ' });
      expect(getUserIdFromRequest(req as any)).toEqual({ error: 'no-token' });
    });
  });

  describe('Invalid token scenarios', () => {
    test('returns invalid error when verification fails', () => {
      const req = makeRequest({ authorization: 'Bearer badtoken' });
      (authService.verifyToken as jest.Mock).mockReturnValue(null);
      expect(getUserIdFromRequest(req as any)).toEqual({ error: 'invalid' });
    });

    test('returns invalid error for expired token', () => {
      const req = makeRequest({ authorization: 'Bearer expiredToken' });
      (authService.verifyToken as jest.Mock).mockReturnValue(null);
      expect(getUserIdFromRequest(req as any)).toEqual({ error: 'invalid' });
    });

    test('returns invalid error for malformed JWT', () => {
      const req = makeRequest({ authorization: 'Bearer not.a.jwt' });
      (authService.verifyToken as jest.Mock).mockReturnValue(null);
      expect(getUserIdFromRequest(req as any)).toEqual({ error: 'invalid' });
    });
  });

  describe('Valid token scenarios', () => {
    test('returns decoded userId on successful verification', () => {
      const req = makeRequest({ authorization: 'Bearer validtoken' });
      (authService.verifyToken as jest.Mock).mockReturnValue({ userId: 'user-123' });
      expect(getUserIdFromRequest(req as any)).toEqual({ userId: 'user-123' });
    });

    test('handles different userId formats', () => {
      const req = makeRequest({ authorization: 'Bearer token' });
      (authService.verifyToken as jest.Mock).mockReturnValue({ userId: '507f1f77bcf86cd799439011' });
      expect(getUserIdFromRequest(req as any)).toEqual({ userId: '507f1f77bcf86cd799439011' });
    });

    test('verifies token from cookie successfully', () => {
      const req = makeRequest({ cookie: 'cookieToken' });
      (authService.verifyToken as jest.Mock).mockReturnValue({ userId: 'user-456' });
      expect(getUserIdFromRequest(req as any)).toEqual({ userId: 'user-456' });
    });
  });
});
