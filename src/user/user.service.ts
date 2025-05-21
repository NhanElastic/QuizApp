import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  ChangePasswordDto,
  CreateUserDtoRequest,
  CreateUserDtoResponse,
} from '../dtos/user.dto';
import { UserRepository } from './user.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(
    userData: CreateUserDtoRequest,
  ): Promise<CreateUserDtoResponse> {
    const existingUser = await this.userRepository.findOneByUsername(
      userData.username,
    );
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const newUser = this.userRepository.create(userData);
    return plainToInstance(CreateUserDtoResponse, newUser);
  }

  async changePasswordForAdmin(
    changePasswordData: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOneById(changePasswordData.id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!changePasswordData.password)
      throw new HttpException(
        'New password is required',
        HttpStatus.BAD_REQUEST,
      );

    await user.updatePassword(changePasswordData.password);
    await this.userRepository.save(user);
  }

  async findOneById(id: string): Promise<CreateUserDtoResponse> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return plainToInstance(CreateUserDtoResponse, user);
  }
}
