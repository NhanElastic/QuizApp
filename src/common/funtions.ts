import { RoleEnum } from './enums/role.enum';

export function getUserLevel(role: RoleEnum = RoleEnum.GUEST): number {
  return role === RoleEnum.GUEST ? 2 : 3;
}
