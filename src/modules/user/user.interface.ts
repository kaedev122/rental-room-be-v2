import { GenderEnum } from '@constants/gender';
import { UserStatusEnum } from '@constants/user';

export interface INewUser {
  email?: string;
  firstName?: string;
  lastName: string;
  phone: string;
  birthday?: string;
  gender?: GenderEnum;
  address?: string;
}

export interface IUserInfo {
  email?: string;
  firstName?: string;
  lastName: string;
  fullName: string;
  code: string;
  phone: string;
  birthday?: string;
  gender?: GenderEnum;
  address?: string;
  avatar?: string;
}
