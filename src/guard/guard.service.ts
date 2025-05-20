import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRepository } from '../user/user.repository';
import { RoleEnum } from '../common/enums/role.enum';

export function AuthGuard(...roles: RoleEnum[]): Type<CanActivate> {
  @Injectable()
  class AuthGuardMixin implements CanActivate {
    constructor(
      private readonly jwtService: JwtService,
      private readonly UserRepository: UserRepository,
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
        const user = await this.UserRepository.findOneById(payload.sub);

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
        throw new UnauthorizedException(error);
      }
    }
  }
  return AuthGuardMixin;
}
