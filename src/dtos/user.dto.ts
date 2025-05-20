import { Exclude } from 'class-transformer';
import { RoleEnum } from '../common/enums/role.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  username: string;
  @IsEnum(RoleEnum)
  role: RoleEnum = RoleEnum.GUEST;
}

export class CreateUserDtoRequest extends UserDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
export class CreateUserDtoResponse extends UserDto {
  @IsString()
  id: string;
  @Exclude()
  password: string;
}

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
