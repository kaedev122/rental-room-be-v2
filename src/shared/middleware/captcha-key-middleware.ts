import { thirdPartyUrls } from '../../constants/constants';
import type { NestMiddleware } from '@nestjs/common';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import axios from 'axios';

export interface IRequestWithApiKey extends Request {
  reCaptToken: string;
}

@Injectable()
export class RequestedWithCaptchaMiddleware implements NestMiddleware {
  async use(req: IRequestWithApiKey, res: Response, next: NextFunction) {
    const { reCaptToken } = req.body;

    const { data, status } = await axios.post(
      `${thirdPartyUrls.googleReCaptVerify}?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${reCaptToken}`,
    );

    /**
   * data response:
   * {
      success: true,
      challenge_ts: '2022-12-13T09:52:33Z',
      hostname: 'localhost'
    }
  */

    if (status !== 200 || !data?.success) {
      throw new HttpException(
        'error.COMMON.NOT_ACCEPTABLE',
        HttpStatus.BAD_REQUEST,
      );
    }

    req.body.reCaptToken = undefined;

    next();
  }
}
