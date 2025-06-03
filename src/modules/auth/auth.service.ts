import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import * as CryptoJS from 'crypto-js';
import mongoose, { Model } from 'mongoose';
import { TranslateOptions } from 'nestjs-i18n';
import { ResponseDto } from '@common/dtos';
import {
  generateHash,
  generateRandomNumber,
  padNumber,
  validateHash,
} from '@common/utils';
import { UserRoleEnum, UserStatusEnum } from '@constants/user';
import {
  ACTIVATE_PW_ACCOUNT,
  MT_CHANGED_PWD,
  MT_OTP_FORGOT_PWD,
  REGEX_OBJ,
} from '@constants/email';
import { LanguageCode } from '@constants/language-code';
import { TokenType } from '@constants/token-type';
import { ApiConfigService, TranslationService } from '@shared/services';
import { UserEntity } from './../user/user.entity';
import {
  ConfirmForgotPwdDto,
  LoginResponseDto,
  TokenPayloadDto,
  UserAuthResponseDto,
  UserLoginDto,
} from './auth.dtos';
import { ILogin } from './auth.interface';
import { GenderEnum } from '@constants/gender';
import { PAD_NUMBER_PREFIX } from '@constants/patterns';
import { CounterService } from '@shared/counter/counter.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserEntity.name) 
    private userModel: Model<UserEntity>,
    private translationService: TranslationService,
    private configService: ApiConfigService,
    private jwtService: JwtService,
    private counterService: CounterService,
  ) {}

  private getUserCodeByNumber(userNumber: number): string {
    const strNumber = (100000 + userNumber).toString();
    return `${strNumber}`;
  }

  async aesObjectEncrypt(obj: object): Promise<UserAuthResponseDto> {
    const key = this.configService.getAESKeyConfig().AESKeyUser;

    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(obj),
      key,
    ).toString();
    return {
      data: ciphertext,
      success: true,
    };
  }

  private getResetPasswordToken() {
    const resetToken = crypto.randomBytes(20).toString('hex');

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return { resetToken, resetPasswordToken, resetPasswordExpire };
  }

  async loginUser(
    payload: UserLoginDto,
    requestedLang: string = LanguageCode.en_US,
  ): Promise<LoginResponseDto> {
    const requiredFields = ['username', 'password'];
    const baseTranslateOption = { lang: requestedLang };
    for (const requiredKey of requiredFields) {
      if (!payload[requiredKey]) {
        await this.thrownBadRequest(`error.fields.CUSTOM_REQUIRED`, {
          ...baseTranslateOption,
          args: { field: requiredKey },
        });
      }
    }

    const [errMsg, statusCode] = this.validateLoginPayload(payload);
    if (errMsg && statusCode) {
      throw new HttpException(
        await this.translationService.translate(errMsg, baseTranslateOption),
        statusCode,
      );
    }

    const userFound = await this.userModel
      .findOne({ username: payload.username })
      .select('password role isDeleted status _id');

    if (!userFound) {
      await this.thrownBadRequest(
        'error.user.USERNAME_OR_PWD_INVALID',
        baseTranslateOption,
      );
    }

    const isPasswordValid = await validateHash(
      payload.password,
      userFound.password,
    );
    if (!isPasswordValid) {
      await this.thrownBadRequest(
        'error.user.USERNAME_OR_PWD_INVALID',
        baseTranslateOption,
      );
    }

    if (userFound.isDeleted || userFound.status === UserStatusEnum.INACTIVE) {
      await this.thrownBadRequest(
        'error.user.ACCOUNT_WAS_INACTIVE',
        baseTranslateOption,
      );
    }

    const token = await this.createAccessToken({
      role: userFound.role,
      userId: userFound._id.toString(),
    });

    await this.userModel.updateOne(
      { _id: userFound._id },
      {
        $unset: {
          forgotPwdOtp: 1,
          forgotPwdExpires: 1,
          forgotPwdResend: 1,
          enteredOTPTime: 1,
        },
      },
    );

    return new LoginResponseDto(true, {
      userId: userFound._id.toString(),
      accessToken: token.accessToken,
    });
  }

  async logoutUser(
    user: UserEntity,
    requestedLang: string = LanguageCode.en_US,
  ): Promise<ResponseDto> {
    const baseTranslateOption = { lang: requestedLang };
    return {
      success: true,
      message: await this.translationService.translate(
        'success.success',
        baseTranslateOption,
      ),
    };
  }

  // async forgotPassword(
  //   email: string,
  //   requestedLang: string = LanguageCode.en_US,
  // ): Promise<ResponseDto> {
  //   const baseTranslateOption = { lang: requestedLang };

  //   if (!REGEX_OBJ.EMAIL.test(email)) {
  //     await this.thrownBadRequest('error.fields.isEmail', baseTranslateOption);
  //   }

  //   const userFound = await this.userModel.findOne({ email });
  //   if (!userFound) {
  //     await this.thrownBadRequest('error.user.notFound', baseTranslateOption);
  //   }

  //   if (userFound.status !== UserStatusEnum.ACTIVE || userFound.isDeleted) {
  //     await this.thrownBadRequest(
  //       'error.user.ACCOUNT_WAS_INACTIVE',
  //       baseTranslateOption,
  //     );
  //   }

  //   const OTP = generateRandomNumber(8, 8);
  //   const lastExpireTime = new Date(userFound.forgotPwdExpires || 1);
  //   lastExpireTime.setTime(lastExpireTime.getTime() + 120 * 60 * 1000);
  //   let forgotPwdResend =
  //     Number(userFound.forgotPwdResend) >= 0
  //       ? userFound.forgotPwdResend + 1
  //       : 0;


  //   if (
  //     new Date(String(userFound.forgotPwdExpires))?.toString() !==
  //       'Invalid Date' &&
  //     lastExpireTime.getTime() < Date.now()
  //   ) {
  //     forgotPwdResend = 0;
  //   }


  //   userFound.forgotPwdOtp = OTP.toString();
  //   userFound.forgotPwdExpires = new Date(Date.now() + 10 * 60 * 1000);
  //   userFound.forgotPwdResend = forgotPwdResend;
  //   const dataOtp = {
  //     forgotPwdOtp: userFound.forgotPwdOtp,
  //     forgotPwdExpires: userFound.forgotPwdExpires,
  //     forgotPwdResend: userFound.forgotPwdResend,
  //   };

  //   if (dataOtp.forgotPwdResend > 5 && lastExpireTime.getTime() > Date.now()) {
  //     await this.thrownBadRequest(
  //       'error.user.resendOTPTooManyTime',
  //       baseTranslateOption,
  //     );
  //   }

  //   await userFound.save();

  //   return {
  //     success: true,
  //     message: await this.translationService.translate(
  //       'success.success',
  //       baseTranslateOption,
  //     ),
  //   };
  // }

  // async confirmPasswordForgot(
  //   payload: ConfirmForgotPwdDto,
  //   requestedLang: string = LanguageCode.en_US,
  // ): Promise<ResponseDto> {
  //   const baseTranslateOption = { lang: requestedLang };

  //   if (!REGEX_OBJ.EMAIL.test(payload.email)) {
  //     await this.thrownBadRequest('error.fields.isEmail', baseTranslateOption);
  //   }

  //   if (payload.password !== payload.rePassword) {
  //     await this.thrownBadRequest(
  //       'error.fields.wrongRePassword',
  //       baseTranslateOption,
  //     );
  //   }

  //   if (!REGEX_OBJ.PWD.test(payload.password)) {
  //     await this.thrownBadRequest('error.fields.pwdWrong', baseTranslateOption);
  //   }

  //   if (!Number(payload.otp)) {
  //     await this.thrownBadRequest(
  //       'error.fields.invalidOtp',
  //       baseTranslateOption,
  //     );
  //   }

  //   const userFound = await this.userModel.findOne({ email: payload.email });
  //   if (!userFound) {
  //     await this.thrownBadRequest('error.user.notFound', baseTranslateOption);
  //   }

  //   if (userFound.status !== UserStatusEnum.ACTIVE || userFound.isDeleted) {
  //     await this.thrownBadRequest(
  //       'error.user.ACCOUNT_WAS_INACTIVE',
  //       baseTranslateOption,
  //     );
  //   }

  //   const enteredOTPTime = (Number(userFound.enteredOTPTime) || 0) + 1;
  //   const timeLocked = new Date(userFound.forgotPwdExpires);
  //   timeLocked.setTime(timeLocked.getTime() + 120 * 60 * 1000);
  //   if (enteredOTPTime - 1 > 5 && timeLocked.getTime() < Date.now()) {
  //     await this.thrownBadRequest(
  //       'error.user.wrongOTPTooManyTime',
  //       baseTranslateOption,
  //     );
  //   }

  //   if (payload.otp !== userFound.forgotPwdOtp || !userFound.forgotPwdOtp) {
  //     if (payload.otp !== userFound.forgotPwdOtp) {
  //       const updated = await this.userModel.findOneAndUpdate(
  //         { _id: userFound._id },
  //         { enteredOTPTime },
  //         { new: true },
  //       );

  //       if (!updated || Number(updated.enteredOTPTime) > 5) {
  //         await this.thrownBadRequest(
  //           'error.user.wrongOTPTooManyTime',
  //           baseTranslateOption,
  //         );
  //       }
  //     }

  //     await this.thrownBadRequest(
  //       'error.fields.invalidOtp',
  //       baseTranslateOption,
  //     );
  //   }

  //   if (userFound.forgotPwdExpires < new Date()) {
  //     await this.thrownBadRequest('error.otpExpired', baseTranslateOption);
  //   }

  //   const isChanged = await this.userModel.updateOne(
  //     { _id: userFound._id },
  //     {
  //       $unset: {
  //         forgotPwdOtp: 1,
  //         forgotPwdExpires: 1,
  //         forgotPwdResend: 1,
  //         enteredOTPTime: 1,
  //       },
  //       $set: {
  //         password: generateHash(payload.password),
  //       },
  //     },
  //   );

  //   if (isChanged.modifiedCount) {
  //     this.mailGunConfigService.sendEmailSystem(
  //       userFound.email,
  //       MT_CHANGED_PWD,
  //       { fullName: userFound.fullName },
  //       userFound.language,
  //     );

  //     return {
  //       success: true,
  //       message: await this.translationService.translate(
  //         'success.user.changePwd',
  //         baseTranslateOption,
  //       ),
  //     };
  //   }

  //   await this.thrownBadRequest(
  //     'error.COMMON.INTERNAL_SERVER_ERROR',
  //     baseTranslateOption,
  //   );
  // }

  async createAccessToken(data: {
    role: unknown;
    userId: string;
  }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync(
        {
          userId: data.userId,
          type: TokenType.ACCESS_TOKEN,
          role: data.role,
        },
        {
          privateKey: this.configService.authConfig.privateKey,
          expiresIn: this.configService.authConfig.jwtExpirationTime,
        },
      ),
    });
  }

  async createRefreshToken(data: { userId: string }): Promise<TokenPayloadDto> {
    return new TokenPayloadDto({
      expiresIn: this.configService.authConfig.jwtExpirationTime,
      accessToken: await this.jwtService.signAsync({
        userId: data.userId,
        type: TokenType.REFRESH_TOKEN,
      }),
    });
  }

  validateLoginPayload(payload: ILogin): Array<any> {
    // if (!REGEX_OBJ.EMAIL.test(payload.username)) {
    //   return ['error.fields.isUsername', HttpStatus.BAD_REQUEST];
    // }

    if (!REGEX_OBJ.PWD.test(payload.password)) {
      return ['error.fields.pwdWrong', HttpStatus.BAD_REQUEST];
    }

    return [];
  }

  private async thrownBadRequest(key: string, options: TranslateOptions) {
    throw new HttpException(
      await this.translationService.translate(key, options),
      HttpStatus.BAD_REQUEST,
    );
  }

  async onModuleInit() {
    await this.initializeAdminAccount();
  }

  async initializeAdminAccount() {
    const admin = await this.userModel.findOne({ role: UserRoleEnum.ADMIN });
    const password = generateHash(process.env.ADMIN_PASSWORD);
    const numberUser = await this.counterService.increaseCounterNumber('userCode');
    if (!admin) {
      await this.userModel.create({
        username: process.env.ADMIN_USERNAME,
        password: password,
        role: UserRoleEnum.ADMIN,
        status: UserStatusEnum.ACTIVE,
        lastName: 'admin',
        email: 'admin',
        phone: 'admin',
        avatar: 'admin',
        address: 'admin',
        gender: GenderEnum.OTHER,
        language: LanguageCode.en_US,
        code: padNumber(PAD_NUMBER_PREFIX.USER, numberUser)
      });
    }
  }
}
