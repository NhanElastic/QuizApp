import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto, SignInResponseDto } from '../dtos/signin.dto';
import {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from '../dtos/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginData: SignInRequestDto): Promise<SignInResponseDto> {
    return await this.authService.signIn(loginData);
  }

  @Post('refresh')
  async refreshToken(
    @Body() data: RefreshTokenRequestDto,
  ): Promise<RefreshTokenResponseDto> {
    return await this.authService.refreshToken(data);
  }
}
