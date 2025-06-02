import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from './../../common/dtos';
import { AuthUser } from './../../decorators/auth-user.decorator';
import { Auth } from './../../decorators/http.decorator';
import { IRequestLanguage } from './../../shared/middleware';
import { UserEntity } from './../user/user.entity';
import {
  ConfirmForgotPwdDto,
  LoginResponseDto,
  UserAuthResponseDto,
  UserLoginDto,
  UserResponseDto,
} from './auth.dtos';
import { AuthService } from './auth.service';

@Controller({
  path: 'auth',
  version: '1',
})
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginResponseDto,
    description: 'Login to get access token',
  })
  async loginUser(
    @Body() payload: UserLoginDto,
    @Req() req: IRequestLanguage,
  ): Promise<ResponseDto> {
    const { requestedLang } = req;
    return await this.authService.loginUser(payload, requestedLang);
  }

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'User info with access token',
  })
  async getCurrentUser(
    @AuthUser() user: UserEntity,
  ): Promise<UserAuthResponseDto> {
    return await this.authService.aesObjectEncrypt(user);
  }

  @Get('/logout')
  @HttpCode(HttpStatus.OK)
  @Auth()
  @ApiOkResponse({
    type: UserResponseDto,
    description: 'User info with access token',
  })
  async logoutUser(
    @AuthUser() user: UserEntity,
    @Req() req: IRequestLanguage,
  ): Promise<ResponseDto> {
    const { requestedLang } = req;
    return await this.authService.logoutUser(user, requestedLang);
  }

  // @Get('/forgot-password')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({
  //   type: ResponseDto,
  //   description: 'Reset password account',
  // })
  // async forgotPasswordController(
  //   @Query('email') email: string,
  //   @Req() req: IRequestLanguage,
  // ): Promise<ResponseDto> {
  //   const { requestedLang } = req;

  //   return await this.authService.forgotPassword(email, requestedLang);
  // }

  // @Patch('/confirm-forgot-password')
  // @HttpCode(HttpStatus.OK)
  // @ApiOkResponse({
  //   type: ResponseDto,
  //   description: 'Confirm forgot password with otp',
  // })
  // async confirmPasswordForgot(
  //   @Body() payload: ConfirmForgotPwdDto,
  //   @Req() req: IRequestLanguage,
  // ): Promise<ResponseDto> {
  //   const { requestedLang } = req;
  //   return await this.authService.confirmPasswordForgot(payload, requestedLang);
  // }
}
