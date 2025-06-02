import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserStatusEnum, TokenType } from '../../constants';
import { ApiConfigService } from '../../shared/services';
import { UserEntity } from '../user/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ApiConfigService,

    @InjectModel(UserEntity.name) 
    private userModel: Model<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.authConfig.publicKey,
    });
  }

  async validate(args: {
    userId: string;
    type: TokenType;
  }): Promise<UserEntity> {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }

    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(args.userId) as never,
    });

    if (!user) throw new UnauthorizedException();

    if (user?.status === UserStatusEnum.UNVERIFIED) {
      throw new HttpException(
        'error.user.UNVERIFIED_MESSAGE',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user || user.status !== UserStatusEnum.ACTIVE)
      throw new UnauthorizedException();

    return { ...user };
  }
}
