import { RoleEnum } from '../../common/enums/role.enum';
import { UserController } from '../user.controller';

describe('UserController', () => {
  let controller: UserController;
  let userService: { createUser: jest.Mock; changePasswordForAdmin: jest.Mock };

  beforeEach(() => {
    userService = {
      createUser: jest.fn(),
      changePasswordForAdmin: jest.fn(),
    };
    controller = new UserController(userService as any);
  });

  describe('createUser', () => {
    it('should call userService.createUser and return result', async () => {
      const dto = { username: 'test', password: 'pass' };
      const response = { id: '1', username: 'test', role: RoleEnum.ADMIN };
      userService.createUser.mockResolvedValue(response);

      const result = await controller.createUser(dto as any);
      expect(userService.createUser).toHaveBeenCalledWith(dto);
      expect(result).toBe(response);
    });
  });

  describe('changePasswordForAdmin', () => {
    it('should call userService.changePasswordForAdmin and return success message', async () => {
      const dto = { userId: '1', oldPassword: 'old', newPassword: 'new' };
      userService.changePasswordForAdmin.mockResolvedValue(undefined);

      const result = await controller.changePasswordForAdmin(dto as any);
      expect(userService.changePasswordForAdmin).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ message: 'Password changed successfully' });
    });
  });
});
