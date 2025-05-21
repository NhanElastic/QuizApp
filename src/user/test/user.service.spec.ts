import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { UserRepository } from '../user.repository';
import { RoleEnum } from '../../common/enums/role.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ChangePasswordDto } from '../../dtos/user.dto';

describe('UserService', () => {
  let userService: UserService;
  let userRepository: UserRepository;

  const userData = {
    id: '1',
    username: 'mockUser',
    password: 'password',
    role: RoleEnum.ADMIN,
  };
  const userDataResponse = {
    id: '1',
    username: 'mockUser',
    role: RoleEnum.ADMIN,
  };
  const userDataRequest = {
    username: 'mockUser',
    password: 'password',
    role: RoleEnum.ADMIN,
  };

  const mockUserRepository = {
    findOneByUsername: jest.fn(),
    create: jest.fn().mockResolvedValue(userData),
    findOneById: jest.fn(),
    save: jest.fn().mockResolvedValue(userData),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user', async () => {
      (userRepository.findOneByUsername as jest.Mock).mockResolvedValueOnce(
        null,
      );
      const user = await userService.createUser(userDataRequest);
      expect(user).toEqual(userDataResponse);
      expect(userRepository.findOneByUsername).toHaveBeenCalledWith(
        userDataRequest.username,
      );
      expect(userRepository.create).toHaveBeenCalledWith(userDataRequest);
    });

    it('should throw an error if user already exists', async () => {
      (userRepository.findOneByUsername as jest.Mock).mockResolvedValueOnce(
        userData,
      );
      const user = userService.createUser(userDataRequest);
      await expect(user).rejects.toThrow(
        new HttpException('User already exists', HttpStatus.BAD_REQUEST),
      );
      expect(userRepository.findOneByUsername).toHaveBeenCalledWith(
        userDataRequest.username,
      );
    });
  });

  describe('changePasswordForAdmin', () => {
    const changePasswordDto: ChangePasswordDto = {
      id: '1',
      password: 'newPassword',
    };
    const mockUser = {
      id: '1',
      username: 'mockUser',
      password: 'oldPassword',
      role: RoleEnum.ADMIN,
      updatePassword: jest.fn(),
    };

    it('should update the password successfully', async () => {
      (userRepository.findOneById as jest.Mock).mockResolvedValueOnce(mockUser);
      (userRepository.save as jest.Mock).mockResolvedValueOnce(mockUser);
      await userService.changePasswordForAdmin(changePasswordDto);
      expect(userRepository.findOneById).toHaveBeenCalledWith(
        changePasswordDto.id,
      );
      expect(mockUser.updatePassword).toHaveBeenCalledWith(
        changePasswordDto.password,
      );
      expect(userRepository.save).toHaveBeenCalledWith(mockUser);
    });

    it('should throw an error if user is not found', async () => {
      (userRepository.findOneById as jest.Mock).mockResolvedValueOnce(null);
      const changePassword =
        userService.changePasswordForAdmin(changePasswordDto);
      await expect(changePassword).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
      expect(userRepository.findOneById).toHaveBeenCalledWith(
        changePasswordDto.id,
      );
    });

    it('should throw an error if new password is empty', async () => {
      const noPasswordDto: ChangePasswordDto = {
        ...changePasswordDto,
        password: '',
      };
      (userRepository.findOneById as jest.Mock).mockResolvedValueOnce(mockUser);
      const changePassword = userService.changePasswordForAdmin(noPasswordDto);
      await expect(changePassword).rejects.toThrow(
        new HttpException('New password is required', HttpStatus.BAD_REQUEST),
      );
      expect(userRepository.findOneById).toHaveBeenCalledWith(noPasswordDto.id);
    });
  });

  describe('findOneById', () => {
    it('should be return user successfully', async () => {
      const userId: string = '1';
      (userRepository.findOneById as jest.Mock).mockResolvedValueOnce(userData);
      const user = await userService.findOneById(userId);
      expect(user).toEqual(userDataResponse);
      expect(userRepository.findOneById).toHaveBeenCalledWith(userId);
    });
    it('should throw an error if user is not found', async () => {
      const userId: string = '1';
      (userRepository.findOneById as jest.Mock).mockResolvedValueOnce(null);
      const user = userService.findOneById(userId);
      await expect(user).rejects.toThrow(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
      expect(userRepository.findOneById).toHaveBeenCalledWith(userId);
    });
  });
});
