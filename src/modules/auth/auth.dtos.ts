import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

import { EMAIL_PATTERN, GenderEnum, UserRoleEnum } from './../../constants';
import { ResponseDto } from './../../common/dtos';
import { UserEntity } from './../user/user.entity';
import mongoose from 'mongoose';

export class TokenPayloadDto {
  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  accessToken: string;

  constructor(data: { expiresIn: number; accessToken: string }) {
    this.expiresIn = data.expiresIn;
    this.accessToken = data.accessToken;
  }
}

export class UserLoginDto {
  @IsString()
  @ApiProperty()
  readonly username: string;

  @IsString()
  @ApiProperty()
  readonly password: string;
}

class LoginPayloadDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  accessToken: string;

  constructor(user: UserEntity, accessToken: string) {
    this.userId = user._id.toString();
    this.accessToken = accessToken;
  }
}

export class LoginResponseDto extends ResponseDto {
  @ApiProperty({ type: LoginPayloadDto })
  declare readonly data: LoginPayloadDto;
}

export class UserDto {
  @ApiProperty()
  @IsOptional()
  _id?: any;

  @ApiProperty()
  @IsOptional()
  username?: string;

  @ApiProperty()
  @IsOptional()
  code?: string;

  @ApiProperty()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsOptional()
  status?: string;

  @ApiProperty()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  fullName?: string;

  @ApiProperty()
  @IsOptional()
  email?: string;

  @ApiProperty()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsOptional()
  avatar?: string;

  @ApiProperty()
  @IsOptional()
  birthday?: Date;

  @ApiProperty()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsOptional()
  gender?: GenderEnum | '';

  @ApiProperty()
  @IsOptional()
  role?: UserRoleEnum;

  @ApiProperty()
  @IsOptional()
  searchKey?: string;

  constructor(user: UserEntity) {
    this._id = user._id;
    this.fullName = user.fullName;
    this.username = user.username;
    this.code = user.code;
    this.password = user.password;
    this.status = user.status;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.phone = user.phone;
    this.avatar = user.avatar;
    this.birthday = user.birthday;
    this.address = user.address;
    this.gender = user.gender || '';
    this.role = user.role;
    this.searchKey = user.searchKey;
  }
}

export class UserAuthResponseDto extends ResponseDto {
  @ApiProperty()
  @IsOptional()
  declare readonly data: string;
}

export class UserResponseDto extends ResponseDto {
  @ApiProperty({ type: UserDto })
  @IsOptional()
  declare readonly data: string;
}

export class ConfirmForgotPwdDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  otp?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  rePassword?: string;
}
