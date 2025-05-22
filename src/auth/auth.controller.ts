import {
  Body,
  Controller,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto, SignInResponseDto } from '../dtos/signin.dto';
import {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from '../dtos/refreshToken.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@UseInterceptors(TransformInterceptor)
@UseInterceptors(LoggingInterceptor)
@UseFilters(HttpExceptionFilter)
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
