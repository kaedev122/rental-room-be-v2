import type {
  CallHandler,
  CanActivate,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';
import { hashApiKey } from '@common/utils';
import { UserEntity } from '@modules/user/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import dayjs from 'dayjs';
import { ContextProvider } from 'providers';
import { BaseStatusEnum, ACCESS_TOKEN } from '@constants/constants';
import { Logger } from 'winston';

interface IRequestExtendUser extends Request {
  user: UserEntity;
}

@Injectable()
export class AuthUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();

    const user = <UserEntity>request.user;

    ContextProvider.setAuthUser(user);

    return next.handle();
  }
}
