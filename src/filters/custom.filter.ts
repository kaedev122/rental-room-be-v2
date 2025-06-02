import type { ArgumentsHost } from '@nestjs/common';
import { Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import type { Response } from 'express';

import { ApiConfigService, TranslationService } from '../shared/services';

@Catch(HttpException)
export class CustomExceptionFilter extends BaseExceptionFilter {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly translationService: TranslationService,
  ) {
    super();
  }

  async catch(exception: HttpException, host: ArgumentsHost): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    // const request = ctx.getRequest();

    const statusCode = exception.getStatus();
    const errors = (exception.getResponse() as any)?.errors;

    const data = (exception.getResponse() as any)?.data;
    let message = exception.message;
    let stackTrace;

    if (this.configService.isDevelopment) {
      stackTrace = exception.stack;
      console.error(stackTrace);
    }

    const translation = await this.translationService.translate(message);

    message = translation;

    response.status(statusCode).json({
      statusCode,
      success: false,
      message,
      stackTrace,
      errors,
      data,
    });
  }
}
