import { Body, Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ChangePasswordDto,
  CreateUserDtoRequest,
  CreateUserDtoResponse,
} from '../dtos/user.dto';
import { AuthGuard } from '../guard/guard.service';
import { RoleEnum } from '../common/enums/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard(RoleEnum.ADMIN))
  @Post()
  async createUser(
    @Body() userData: CreateUserDtoRequest,
  ): Promise<CreateUserDtoResponse> {
    return await this.userService.createUser(userData);
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
