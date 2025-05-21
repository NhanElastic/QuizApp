import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository } from '../user.repository';
import { UserEntity } from '../../typeorm/entities/user.entity';

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let userRepoMock: jest.Mocked<Repository<UserEntity>>;

  beforeEach(async () => {
    userRepoMock = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepoMock,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
  });

  it('should create a new user', async () => {
    const userDto = { username: 'testuser', password: 'pass' } as any;
    const createdUser = { id: '1', ...userDto } as UserEntity;
    userRepoMock.create.mockReturnValue(createdUser);
    userRepoMock.save.mockResolvedValue(createdUser);

    const result = await userRepository.create(userDto);

    expect(userRepoMock.create).toHaveBeenCalledWith(userDto);
    expect(userRepoMock.save).toHaveBeenCalledWith(createdUser);
    expect(result).toEqual(createdUser);
  });

  it('should find one user by username', async () => {
    const user = { id: '1', username: 'testuser' } as UserEntity;
    userRepoMock.findOne.mockResolvedValue(user);

    const result = await userRepository.findOneByUsername('testuser');

    expect(userRepoMock.findOne).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
    expect(result).toEqual(user);
  });

  it('should find one user by id', async () => {
    const user = { id: '1', username: 'testuser' } as UserEntity;
    userRepoMock.findOne.mockResolvedValue(user);

    const result = await userRepository.findOneById('1');

    expect(userRepoMock.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toEqual(user);
  });

  it('should save a user', async () => {
    const user = { id: '1', username: 'testuser' } as UserEntity;
    userRepoMock.save.mockResolvedValue(user);

    const result = await userRepository.save(user);

    expect(userRepoMock.save).toHaveBeenCalledWith(user);
    expect(result).toEqual(user);
  });
});
