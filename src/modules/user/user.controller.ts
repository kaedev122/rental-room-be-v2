import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Put,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from '@common/dtos/response.dto';
import { AuthUser } from '@decorators/auth-user.decorator';
import { Auth } from '@decorators/http.decorator';
import { IRequestLanguage } from '@shared/middleware/request-lang-middleware';
import {
  QueryListUserDto,
} from './user.dtos';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '1',
})
@ApiTags('user')
export class UserController {
  constructor(private userService: UserService) {}

  // @Post('/new')
  // @Auth()
  // @HttpCode(HttpStatus.OK)
  // async createNewUser(
  //   @Body() payload: NewUserDto,
  //   @AuthUser() user: UserEntity,
  //   @Req() req: IRequestLanguage,
  // ): Promise<ResponseDto> {
  //   const { requestedLang } = req;
  //   const origin = req.get('origin');
  //   return await this.userService.createNewUser(
  //     payload,
  //     user,
  //     origin,
  //     requestedLang,
  //   );
  // }

  @Get('/list')
  @Auth()
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: ResponseDto,
    description: 'Get and filter users by condition',
  })
  async getListUser(
    @Query(new ValidationPipe({ transform: true })) payload: QueryListUserDto,
    @Req() req: IRequestLanguage,
  ): Promise<ResponseDto> {
    const { requestedLang } = req;
    return await this.userService.getListUser(payload, requestedLang);
  }
}
