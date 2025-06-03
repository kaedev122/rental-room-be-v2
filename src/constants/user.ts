export enum UserStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  // UNVERIFIED = 'unverified',
}

export const ListUserStatusEnum: string[] = Object.values(UserStatusEnum);

export enum UserRoleEnum {
  ADMIN = 'admin',
  OWNER = 'owner',
  GUEST = 'guest',
}

export const ListUserRoleEnum: string[] = Object.values(UserRoleEnum);