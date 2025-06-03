import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Types } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserStatusEnum, TokenType, UserRoleEnum } from '../../constants';
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
    role: UserRoleEnum;
  }): Promise<UserEntity> {
    if (args.type !== TokenType.ACCESS_TOKEN) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.userModel.findOne({
        _id: new Types.ObjectId(args.userId) as never,
      });
      if (!user) {
        throw new UnauthorizedException();
      }

      if (user?.status === UserStatusEnum.INACTIVE) {
        throw new HttpException(
          'error.user.ACCOUNT_WAS_INACTIVE',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (user.status !== UserStatusEnum.ACTIVE) {
        throw new UnauthorizedException();
      }

      // Convert Mongoose document to plain JavaScript object
      const userObject = user.toObject ? user.toObject() : JSON.parse(JSON.stringify(user));
      
      return userObject;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
