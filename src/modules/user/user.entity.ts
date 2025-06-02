import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type {
  CallbackWithoutResultAndOptionalError,
  HydratedDocument,
} from 'mongoose';

import mongoose from 'mongoose';
import { DatabaseEntityAbstract } from '@common/abstract.entity';
import {
  GenderEnum,
  UserStatusEnum,
  UserRoleEnum
} from '../../constants';
import { DatabaseEntity } from '@decorators/database.decorator';

@Schema()
@DatabaseEntity({ collection: 'users' })
export class UserEntity extends DatabaseEntityAbstract {
  @Prop({
    required: true,
    trim: true,
    unique: true,
    index: true,
    lowercase: true,
    minlength: 5,
    maxlength: 150,
  })
  username: string;

  @Prop({
    required: true,
    trim: true,
    index: true,
    minlength: 2,
    maxlength: 50,
    unique: true,
    uppercase: true,
  })
  code: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 8,
    select: false,
  })
  password: string;

  @Prop({
    enum: UserStatusEnum,
    default: UserStatusEnum.UNVERIFIED,
  })
  status: UserStatusEnum;

  @Prop({
    required: false,
    trim: true,
    default: '',
    maxlength: 30,
  })
  firstName?: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 30,
  })
  lastName: string;

  @Prop({
    trim: true,
    default: '',
  })
  fullName: string;

  @Prop({
    required: false,
    trim: true,
    minlength: 2,
    maxlength: 100,
  })
  email?: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 20,
  })
  phone: string;

  @Prop({
    required: false,
    trim: true,
    default: '',
  })
  avatar?: string;

  @Prop({
    required: false,
    type: Date,
  })
  birthday?: Date;

  @Prop({
    required: false,
    trim: true,
    default: '',
  })
  address?: string;

  @Prop({
    required: false,
    enum: GenderEnum,
  })
  gender?: GenderEnum;

  @Prop({
    enum: UserRoleEnum,
    default: UserRoleEnum.OWNER,
  })
  role: UserRoleEnum;

  @Prop({
    trim: true,
    default: '',
  })
  searchKey?: string;

  @Prop({
    required: false,
    type: Date,
  })
  forgotPwdExpires?: Date;

  @Prop({
    required: false,
    type: Number,
  })
  forgotPwdResend?: number;

  @Prop({
    required: false,
    type: Number,
  })
  forgotPwdOtp?: number;
}

export const UserSchema = SchemaFactory.createForClass(UserEntity);

export type UserDocument = HydratedDocument<UserEntity>;

UserSchema.pre('save', function (next: CallbackWithoutResultAndOptionalError) {
  this.email = this.email.toLowerCase();
  next();
});

UserSchema.pre('save', function () {
  this.fullName = `${this.firstName || ''} ${this.lastName}`;
  this.searchKey = `${this.code}${this.phone}${this.firstName || ''}${this.lastName}`.toLowerCase();
});
