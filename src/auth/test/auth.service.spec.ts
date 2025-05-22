import { Test, TestingModule } from '@nestjs/testing';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { UserRepository } from '../../user/user.repository';
import { AuthService } from '../auth.service';
import { RoleEnum } from '../../common/enums/role.enum';
import { UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../../typeorm/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: UserRepository;
  let jwtService: JwtService;

  const userEntityMock = {
    id: '1',
    username: 'testuser',
    password: 'hashedpassword',
    role: RoleEnum.GUEST,
    verifyPassword: jest.fn(),
  } as unknown as UserEntity;
  const mockAccessToken = 'mockAccessToken';
  const mockRefreshToken = 'mockRefreshToken';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useValue: {
            findOneByUsername: jest.fn(),
            findOneById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('refreshToken', () => {
    it('should return access token if refresh token is valid', async () => {
      (jwtService.verifyAsync as jest.Mock).mockResolvedValueOnce({
        sub: userEntityMock.id,
      });
      (userRepository.findOneById as jest.Mock).mockResolvedValueOnce(
        userEntityMock,
      );
      (jwtService.signAsync as jest.Mock).mockResolvedValueOnce(
        mockAccessToken,
      );
      const result = await authService.refreshToken({
        refreshToken: mockRefreshToken,
      });
      expect(result).toEqual({ accessToken: mockAccessToken });
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(mockRefreshToken);
      expect(userRepository.findOneById).toHaveBeenCalledWith(
        userEntityMock.id,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: userEntityMock.id },
        {
          expiresIn: '15m',
        },
      );
    });

    it('should throw UnauthorizedException if token is expired', async () => {
      (jwtService.verifyAsync as jest.Mock).mockRejectedValue(
        new TokenExpiredError('Token expired', new Date()),
      );
      const result = authService.refreshToken({
        refreshToken: mockRefreshToken,
      });
      await expect(result).rejects.toThrow(
        new UnauthorizedException('Token expired'),
      );
    });
    it('should throw UnauthorizedException if user is not found', async () => {
      (jwtService.verifyAsync as jest.Mock).mockResolvedValueOnce({
        sub: userEntityMock.id,
      });
      (userRepository.findOneById as jest.Mock).mockResolvedValueOnce(null);
      const result = authService.refreshToken({
        refreshToken: mockRefreshToken,
      });
      await expect(result).rejects.toThrow(new UnauthorizedException());
    });
    it('should throw UnauthorizedException if token is invalid', async () => {
      (jwtService.verifyAsync as jest.Mock).mockRejectedValue(
        new Error('Invalid token'),
      );
      const result = authService.refreshToken({
        refreshToken: mockRefreshToken,
      });
      await expect(result).rejects.toThrow(
        new UnauthorizedException('Invalid token'),
      );
    });
  });

  describe('createTokens', () => {
    const mockPayload = { sub: 'string' };
    it('should return access and refresh token', async () => {
      (jwtService.signAsync as jest.Mock).mockResolvedValueOnce(
        mockAccessToken,
      );
      (jwtService.signAsync as jest.Mock).mockResolvedValueOnce(
        mockRefreshToken,
      );
      const result = await authService.createTokens(mockPayload);
      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith(mockPayload, {
        expiresIn: '15m',
      });
      expect(jwtService.signAsync).toHaveBeenCalledWith(mockPayload, {
        expiresIn: '7d',
      });
    });
  });

  describe('signIn', () => {
    const mockSignInDto = {
      username: 'username',
      password: 'password',
    };

    it('should return both access token and refresh token', async () => {
      (userRepository.findOneByUsername as jest.Mock).mockResolvedValueOnce(
        userEntityMock,
      );
      userEntityMock.verifyPassword = jest.fn().mockResolvedValue(true);
      const createTokensSpy = jest
        .spyOn(authService, 'createTokens')
        .mockResolvedValueOnce({
          accessToken: mockAccessToken,
          refreshToken: mockRefreshToken,
        });
      const result = await authService.signIn(mockSignInDto);
      expect(result).toEqual({
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      });
      expect(userRepository.findOneByUsername).toHaveBeenCalledWith(
        mockSignInDto.username,
      );
      expect(userEntityMock.verifyPassword).toHaveBeenCalledWith(
        mockSignInDto.password,
      );
      expect(createTokensSpy).toHaveBeenCalledWith({ sub: userEntityMock.id });
      createTokensSpy.mockRestore();
    });

    it('should return UnauthorizedException if user is null', async () => {
      (userRepository.findOneByUsername as jest.Mock).mockResolvedValueOnce(
        null,
      );
      const result = authService.signIn(mockSignInDto);
      await expect(result).rejects.toThrow(new UnauthorizedException());
      expect(userRepository.findOneByUsername).toHaveBeenCalledWith(
        mockSignInDto.username,
      );
    });

    it('should return UnauthorizedException if password is incorrect', async () => {
      (userRepository.findOneByUsername as jest.Mock).mockResolvedValueOnce(
        userEntityMock,
      );
      userEntityMock.verifyPassword = jest.fn().mockResolvedValue(false);
      const result = authService.signIn(mockSignInDto);
      await expect(result).rejects.toThrow(new UnauthorizedException());
      expect(userRepository.findOneByUsername).toHaveBeenCalledWith(
        mockSignInDto.username,
      );
      expect(userEntityMock.verifyPassword).toHaveBeenCalledWith(
        mockSignInDto.password,
      );
    });
  });
});
