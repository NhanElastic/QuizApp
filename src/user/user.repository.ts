import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../typeorm/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDtoRequest } from '../dtos/user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(user: CreateUserDtoRequest): Promise<UserEntity> {
    const newUser = this.userRepository.create(user);
    return this.save(newUser);
  }

  async findOneByUsername(username: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  async findOneById(id: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async save(user: UserEntity): Promise<UserEntity> {
    return await this.userRepository.save(user);
  }
}
