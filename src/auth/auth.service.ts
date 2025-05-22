import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { SignInRequestDto, SignInResponseDto } from '../dtos/signin.dto';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from '../dtos/refreshToken.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async refreshToken(
    refreshToken: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    try {
      const payload: { sub: string } = await this.jwtService.verifyAsync(
        refreshToken.refreshToken,
      );

      const user = await this.userRepository.findOneById(payload.sub);
      if (!user) {
        throw new UnauthorizedException();
      }
      const newPayload = { sub: user.id };
      return {
        accessToken: await this.jwtService.signAsync(newPayload, {
          expiresIn: '15m',
        }),
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Token expired');
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  async createTokens(payload: { sub: string }): Promise<SignInResponseDto> {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }
  async signIn(data: SignInRequestDto): Promise<SignInResponseDto> {
    const user = await this.userRepository.findOneByUsername(data.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    const isCorrectPassword = await user.verifyPassword(data.password);

    if (!isCorrectPassword) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id };
    return await this.createTokens(payload);
  }
}
