import { UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AuthGuard } from './guard.service';
import { RoleEnum } from '../common/enums/role.enum';

describe('AuthGuard', () => {
  let jwtService: { verifyAsync: jest.Mock };
  let userService: { findOneById: jest.Mock };
  let context: Partial<ExecutionContext>;
  let request: any;

  const userMock = { id: '1', role: RoleEnum.ADMIN };

  beforeEach(() => {
    jwtService = { verifyAsync: jest.fn() };
    userService = { findOneById: jest.fn() };
    request = { headers: {}, user: undefined };
    context = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as unknown as ExecutionContext;
  });

  function getGuard(...roles: RoleEnum[]) {
    return new (AuthGuard(...roles))(jwtService as any, userService as any);
  }

  it('should allow access with valid token and role', async () => {
    request.headers.authorization = 'Bearer validtoken';
    jwtService.verifyAsync.mockResolvedValue({ sub: userMock.id });
    userService.findOneById.mockResolvedValue(userMock);

    const guard = getGuard(RoleEnum.ADMIN);
    await expect(guard.canActivate(context as ExecutionContext)).resolves.toBe(
      true,
    );
    expect(request.user).toEqual(userMock);
  });

  it('should throw UnauthorizedException if no token', async () => {
    request.headers.authorization = undefined;
    const guard = getGuard();
    await expect(
      guard.canActivate(context as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if user not found', async () => {
    request.headers.authorization = 'Bearer validtoken';
    jwtService.verifyAsync.mockResolvedValue({ sub: userMock.id });
    userService.findOneById.mockResolvedValue(null);

    const guard = getGuard();
    await expect(
      guard.canActivate(context as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if user role is not allowed', async () => {
    request.headers.authorization = 'Bearer validtoken';
    jwtService.verifyAsync.mockResolvedValue({ sub: userMock.id });
    userService.findOneById.mockResolvedValue({
      ...userMock,
      role: RoleEnum.GUEST,
    });

    const guard = getGuard(RoleEnum.ADMIN);
    await expect(
      guard.canActivate(context as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException on token verification error', async () => {
    request.headers.authorization = 'Bearer invalidtoken';
    jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

    const guard = getGuard();
    await expect(
      guard.canActivate(context as ExecutionContext),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException with "Token expired" if token is expired', async () => {
    request.headers.authorization = 'Bearer expiredtoken';
    jwtService.verifyAsync.mockRejectedValue(
      new TokenExpiredError('jwt expired', new Date()),
    );
    const guard = getGuard();
    await expect(
      guard.canActivate(context as ExecutionContext),
    ).rejects.toThrow('Token expired');
  });
});
