import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { RoleEnum } from '../common/enums/role.enum';
import { UserService } from '../user/user.service';

export function AuthGuard(...roles: RoleEnum[]): Type<CanActivate> {
  @Injectable()
  class AuthGuardMixin implements CanActivate {
    constructor(
      private readonly jwtService: JwtService,
      private readonly UserService: UserService,
    ) {}

    private extractTokenFromHeader(request: Request): string | undefined {
      const [type, token] = request.headers.authorization?.split(' ') || [];
      return type === 'Bearer' ? token : undefined;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const request = context.switchToHttp().getRequest<Request>();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        throw new UnauthorizedException();
      }

      try {
        const payload: { sub: string } =
          await this.jwtService.verifyAsync(token);
        const user = await this.UserService.findOneById(payload.sub);

        if (!user) {
          throw new UnauthorizedException();
        }

        if (
          (roles.length > 0 && roles.some((role) => role === user.role)) ||
          !roles ||
          roles.length === 0
        ) {
          request['user'] = user;
          return true;
        }
        throw new UnauthorizedException('You does not have permission');
      } catch (error) {
        Logger.error('Error in AuthGuard:', error);
        if (error instanceof TokenExpiredError) {
          throw new UnauthorizedException('Token expired');
        }
        throw new UnauthorizedException(error);
      }
    }
  }
  return AuthGuardMixin;
}
