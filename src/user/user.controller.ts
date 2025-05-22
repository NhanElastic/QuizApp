import {
  Body,
  Controller,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ChangePasswordDto,
  CreateUserDtoRequest,
  CreateUserDtoResponse,
} from '../dtos/user.dto';
import { AuthGuard } from '../guard/guard.service';
import { RoleEnum } from '../common/enums/role.enum';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { HttpExceptionFilter } from '../common/filters/http-exception.filter';

@UseInterceptors(TransformInterceptor)
@UseInterceptors(LoggingInterceptor)
@UseFilters(HttpExceptionFilter)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard(RoleEnum.ADMIN))
  @Post()
  createUser(
    @Body() userData: CreateUserDtoRequest,
  ): Promise<CreateUserDtoResponse> {
    return this.userService.createUser(userData);
  }

  @UseGuards(AuthGuard(RoleEnum.ADMIN))
  @Patch('change-password')
  async changePasswordForAdmin(
    @Body() changePasswordData: ChangePasswordDto,
  ): Promise<{ message: string }> {
    await this.userService.changePasswordForAdmin(changePasswordData);
    return { message: 'Password changed successfully' };
  }
}
