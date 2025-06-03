/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { ResponseDto } from './../../common/dtos';
import {
  BaseListStatusEnum
} from './../../constants/constants';

import { LanguageCode } from './../../constants/language-code';
import { TranslationService } from './../../shared/services';
import {
  NewUserDto,
  QueryListUserDto,
} from './user.dtos';
import { UserEntity } from './user.entity';
import { generateHash, padNumber } from '@common/utils';
import { UserRoleEnum, UserStatusEnum } from '@constants/user';
import { REGEX_OBJ } from '@constants/email';
import { CounterService } from './../../shared/counter/counter.service';
import { ListGenderEnum } from '@constants/gender';
import { PAD_NUMBER_PREFIX } from '@constants/patterns';

const baseSelectUser = {
  fullName: 1,
  code: 1,
  legacyId: 1,
  email: 1,
  avatar: 1,
  phone: 1,
  gender: 1,
  birthday: 1,
  address: 1,
  status: 1,
  language: 1,
  role: 1,
  tier: 1,
  timezoneOffset: 1,
  isDeleted: 1,
  createdAt: 1,
  updatedAt: 1,
};

@Injectable()
export class UserService {
  constructor(
    @InjectModel(UserEntity.name) private userModel: Model<UserEntity>,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,

    private counterService: CounterService,
    private translationService: TranslationService,
  ) {}

  private validateNewUser(payload: NewUserDto): Array<any> {
    if (payload?.email && !REGEX_OBJ.EMAIL.test(payload.email)) {
      return ['error.fields.isEmail', HttpStatus.BAD_REQUEST];
    }

    if (!REGEX_OBJ.PHONE_NUMBER.test(payload.phone)) {
      return ['error.fields.invalidPhone', HttpStatus.BAD_REQUEST];
    }

    if (
      payload?.birthday &&
      new Date(payload.birthday).toString() === 'Invalid Date'
    ) {
      return [
        'error.fields.CUSTOM_INVALID_FORMAT',
        HttpStatus.BAD_REQUEST,
        { field: 'Birthday' },
      ];
    }

    if (payload?.gender && !ListGenderEnum.includes(payload.gender)) {
      return [
        'error.fields.CUSTOM_INVALID',
        HttpStatus.BAD_REQUEST,
        { field: 'Gender' },
      ];
    }

    if (!REGEX_OBJ.PWD.test(payload.password)) {
      return [
        'error.fields.pwdWrong',
        HttpStatus.BAD_REQUEST,
        { field: 'Password' },
      ];
    }

    return [];
  }

  async getListUser(
    query: QueryListUserDto,
    requestedLang = LanguageCode.en_US,
  ): Promise<ResponseDto> {
    const baseTranslateOption = { lang: requestedLang || LanguageCode.en_US };
    const condition = {
      isDeleted: false,
      role: {
        $ne: UserRoleEnum.ADMIN,
      },
    };
    const limit = Number(query.totalItem) ? Number(query.totalItem) * 1 : 10;
    const skip = Number(query.pageIndex) || 1;
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);

    if (query.status && BaseListStatusEnum.includes(query.status)) {
      Object.assign(condition, { status: query.status });
    }

    if (query.keyword) {
      Object.assign(condition, {
        $or: [
          { fullName: { $regex: query.keyword, $options: 'i' } },
          { code: { $regex: query.keyword, $options: 'i' } },
          { email: { $regex: query.keyword, $options: 'i' } },
        ],
      });
    }

    if (
      startDate.toString() !== 'Invalid Date' &&
      endDate.toString() !== 'Invalid Date' &&
      startDate < endDate
    ) {
      Object.assign(condition, {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      });
    }

    const [listUser, total] = await Promise.all([
      this.userModel
        .find(condition)
        .sort({ createdAt: -1 })
        .select(baseSelectUser)
        .limit(limit)
        .skip((skip - 1) * limit)
        .lean(),
      this.userModel.countDocuments(condition),
    ]);

    return {
      success: true,
      message: await this.translationService.translate(
        'success.getData',
        baseTranslateOption,
      ),
      data: listUser,
      total,
    };
  }

  async createNewUser(
    payload: NewUserDto,
    requestedLang = LanguageCode.en_US,
  ): Promise<ResponseDto> {
    const requiredFields = ['username', 'password', 'lastName', 'phone', 'role'];
    const baseTranslateOption = { lang: requestedLang || LanguageCode.en_US };
    for (const requiredKey of requiredFields) {
      if (!payload[requiredKey]) {
        throw new HttpException(
          await this.translationService.translate(
            `error.fields.CUSTOM_REQUIRED`,
            {
              ...baseTranslateOption,
              args: { field: requiredKey },
            },
          ),
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const userFound = await this.userModel.findOne({ username: payload.username });
    if (userFound) {
      throw new HttpException(
        await this.translationService.translate(
          'error.user.USERNAME_ALREADY_EXISTS',
          baseTranslateOption,
        ),
        HttpStatus.BAD_REQUEST,
      );
    }

    const [errMsg, statusCode, options = {}] = this.validateNewUser(payload);
    if (errMsg && statusCode) {
      throw new HttpException(
        await this.translationService.translate(errMsg, {
          ...baseTranslateOption,
          args: options,
        }),
        statusCode,
      );
    }

    const numberUser = await this.counterService.increaseCounterNumber('userCode');
    const userData = {
      ...payload,
      code: padNumber(PAD_NUMBER_PREFIX.USER, numberUser),
      password: generateHash(payload.password),
      role: payload.role || UserRoleEnum.GUEST,
    };
    const newUser = new this.userModel(userData);
    await newUser.save();
    return {
      success: true,
      message: await this.translationService.translate(
        'success.success',
        { lang: requestedLang },
      ),
    };
  }
}