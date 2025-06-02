import { LanguageCode } from './../../constants/language-code';
import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

export interface IRequestLanguage extends Request {
  // requestedLang: string;
  requestedLang: LanguageCode;
}

@Injectable()
export class RequestedWithMiddleware implements NestMiddleware {
  use(req: IRequestLanguage, res: Response, next: NextFunction) {
    req.requestedLang =
      (req.headers['x-requested-with'] as LanguageCode) ||
      (req.headers['x-language-code'] as LanguageCode) ||
      LanguageCode.en_US;
    next();
  }
}
