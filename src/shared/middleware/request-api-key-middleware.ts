import type { NestMiddleware } from '@nestjs/common';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

export interface IRequestWithApiKey extends Request {
  requestedLang: string;
}

@Injectable()
export class RequestedWithApiKeyMiddleware implements NestMiddleware {
  use(req: IRequestWithApiKey, res: Response, next: NextFunction) {
    next();
  }
}
