import { AuthController } from '../auth.controller';
import { SignInRequestDto, SignInResponseDto } from '../../dtos/signin.dto';
import {
  RefreshTokenRequestDto,
  RefreshTokenResponseDto,
} from '../../dtos/refreshToken.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: { signIn: jest.Mock; refreshToken: jest.Mock };

  beforeEach(() => {
    authService = {
      signIn: jest.fn(),
      refreshToken: jest.fn(),
    };
    controller = new AuthController(authService as any);
  });

  describe('login', () => {
    it('should call authService.signIn and return tokens', async () => {
      const dto: SignInRequestDto = { username: 'user', password: 'pass' };
      const response: SignInResponseDto = {
        accessToken: 'access',
        refreshToken: 'refresh',
      };
      authService.signIn.mockResolvedValue(response);

      const result = await controller.login(dto);
      expect(authService.signIn).toHaveBeenCalledWith(dto);
      expect(result).toBe(response);
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshToken and return new access token', async () => {
      const dto: RefreshTokenRequestDto = { refreshToken: 'refresh' };
      const response: RefreshTokenResponseDto = { accessToken: 'newAccess' };
      authService.refreshToken.mockResolvedValue(response);

      const result = await controller.refreshToken(dto);
      expect(authService.refreshToken).toHaveBeenCalledWith(dto);
      expect(result).toBe(response);
    });
  });
});
