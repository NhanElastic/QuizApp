import { Injectable } from '@nestjs/common';
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
      throw new Error('User already exists');
    }
    const newUser = this.userRepository.create(userData);
    return plainToInstance(CreateUserDtoResponse, newUser);
  }

  async changePasswordForAdmin(
    changePasswordData: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.userRepository.findOneById(changePasswordData.id);
    if (!user) {
      throw new Error('User not found');
    }
    if (!changePasswordData.password)
      throw new Error('New password is required');

    await user.updatePassword(changePasswordData.password);
    await this.userRepository.save(user);
  }

  async findOneById(id: string): Promise<CreateUserDtoResponse> {
    const user = await this.userRepository.findOneById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return plainToInstance(CreateUserDtoResponse, user);
  }

  async findOneByUsername(username: string): Promise<CreateUserDtoResponse> {
    const user = await this.userRepository.findOneByUsername(username);
    if (!user) {
      throw new Error('User not found');
    }
    return plainToInstance(CreateUserDtoResponse, user);
  }
}
