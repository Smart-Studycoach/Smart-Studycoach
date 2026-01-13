import { requireAuth } from '@/infrastructure/utils/requireAuth';
import { NextResponse } from 'next/server';

jest.mock('@/infrastructure/utils/auth', () => ({
  getTokenFromRequest: jest.fn()
}));

jest.mock('@/infrastructure/container', () => ({
  authService: {
    verifyToken: jest.fn()
  }
}));

const { getTokenFromRequest } = require('@/infrastructure/utils/auth');
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

describe('requireAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns userId when token is valid', () => {
    const req = makeRequest({ authorization: 'Bearer validToken' });
    getTokenFromRequest.mockReturnValue('validToken');
    authService.verifyToken.mockReturnValue({ userId: 'user123' });

    const result = requireAuth(req as any);

    expect(result).toEqual({ userId: 'user123' });
  });

  test('returns 401 response when no token present', () => {
    const req = makeRequest({});
    getTokenFromRequest.mockReturnValue(null);

    const result = requireAuth(req as any);

    expect(result).toBeInstanceOf(NextResponse);
    expect((result as NextResponse).status).toBe(401);
  });

  test('returns 401 response when token verification fails', () => {
    const req = makeRequest({ authorization: 'Bearer invalidToken' });
    getTokenFromRequest.mockReturnValue('invalidToken');
    authService.verifyToken.mockReturnValue(null);

    const result = requireAuth(req as any);

    expect(result).toBeInstanceOf(NextResponse);
    expect((result as NextResponse).status).toBe(401);
  });

  test('handles token from cookie', () => {
    const req = makeRequest({ cookie: 'cookieToken' });
    getTokenFromRequest.mockReturnValue('cookieToken');
    authService.verifyToken.mockReturnValue({ userId: 'user456' });

    const result = requireAuth(req as any);

    expect(result).toEqual({ userId: 'user456' });
  });

  test('returns userId with different ID formats', () => {
    const req = makeRequest({ authorization: 'Bearer token' });
    getTokenFromRequest.mockReturnValue('token');
    authService.verifyToken.mockReturnValue({ userId: '507f1f77bcf86cd799439011' });

    const result = requireAuth(req as any);

    expect(result).toEqual({ userId: '507f1f77bcf86cd799439011' });
  });
});
