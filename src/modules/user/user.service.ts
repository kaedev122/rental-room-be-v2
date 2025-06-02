/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable } from '@nestjs/common';
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
  QueryListUserDto,
} from './user.dtos';
import { UserEntity } from './user.entity';

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

    private translationService: TranslationService,
  ) {}
  async getListUser(
    query: QueryListUserDto,
    requestedLang = LanguageCode.en_US,
  ): Promise<ResponseDto> {
    const baseTranslateOption = { lang: requestedLang || LanguageCode.en_US };
    const condition = { isDeleted: false };
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
}
