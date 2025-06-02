import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

export class NewUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsOptional()
  phone: string;

  @ApiProperty({ required: false })
  @IsOptional()
  birthday?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  gender?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  address?: string;
}

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  firstName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  lastName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  birthday?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  gender: string;

  @ApiProperty({ required: false })
  @IsOptional()
  address: string;

  @ApiProperty({ required: false })
  @IsOptional()
  email?: string;
}

export class UpdateUserConstructorDto extends UpdateUserDto {
  constructor(payload: UpdateUserDto) {
    super();
    this.firstName = payload.firstName;
    this.lastName = payload.lastName;
    this.phone = payload.phone;
    this.birthday = payload.birthday;
    this.gender = payload.gender;
    this.address = payload.address;
    this.email = payload.email;
  }
}

export class QueryListUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  keyword?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  startDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  endDate?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  pageIndex?: string | number;

  @ApiProperty({ required: false })
  @IsOptional()
  totalItem?: string | number;
}

export class GetDetailUserDto {
  @ApiProperty()
  @IsOptional()
  _id?: string;

  @ApiProperty()
  @IsOptional()
  code?: string;

  @ApiProperty()
  @IsOptional()
  email?: string;
}

export class ChangePwdDto {
  @ApiProperty()
  @IsOptional()
  currentPwd: string;

  @ApiProperty()
  @IsOptional()
  newPwd: string;

  @ApiProperty()
  @IsOptional()
  confirmPwd: string;
}

export class ChangeStatusUserDto {
  @ApiProperty()
  @IsOptional()
  userId: string;

  @ApiProperty()
  @IsOptional()
  status: string;
}

export class UpdateProfile {
  @ApiProperty({ required: false })
  @IsOptional()
  avatar?: string;

  @ApiProperty()
  @IsOptional()
  fullName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  phone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  birthday?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  gender?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  address?: string;
}