import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, UnprocessableEntityException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { ValidationError } from 'class-validator';
import type { Response } from 'express';

import { ApiConfigService, TranslationService } from '../shared/services';

@Catch(UnprocessableEntityException)
export class UnprocessableEntityFilter
  implements ExceptionFilter<UnprocessableEntityException>
{
  constructor(
    public reflector: Reflector,
    private readonly configService: ApiConfigService,
    private readonly translationService: TranslationService,
  ) {}

  async catch(
    exception: UnprocessableEntityException,
    host: ArgumentsHost,
  ): Promise<void> {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const statusCode = exception.getStatus();

    let stackTrace;

    if (this.configService.isDevelopment) {
      stackTrace = exception.stack;
      console.error(stackTrace);
    }

    const exceptionResponse = exception.getResponse() as {
      message: ValidationError[];
    };

    const validationErrors = exceptionResponse.message;
    // this.validationFilter(validationErrors);

    if (validationErrors.length > 0) {
      const constrains = validationErrors[0].constraints;

      if (constrains) {
        const keys = Object.keys(constrains);

        let target = '';

        if (validationErrors[0].target) {
          target =
            (validationErrors[0].target[
              validationErrors[0].property
            ] as string) + ' - ';
        }

        let message = `error.fields.${keys[0]}`;

        const translation = await this.translationService.translate(message);

        message = target + translation;

        response.status(statusCode).json({
          statusCode,
          success: false,
          message,
          stackTrace,
        });
      }
    }
  }
}
