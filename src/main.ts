import { NestFactory, Reflector } from '@nestjs/core';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import * as express from 'express';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';
import compression from 'compression';
import { middleware as expressCtx } from 'express-ctx';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import * as mongoose from 'mongoose';
import { AppModule } from './app.module';
import { setupSwagger } from './setup-swagger';
import { CustomExceptionFilter, UnprocessableEntityFilter } from './filters';
import { TranslationService } from './shared/services';
import { TranslationInterceptor } from './interceptors';
import {
  ValidationPipe,
  ValidationError,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UnprocessableEntityExceptionFilter } from './filters/unprocessable-entity.filter';

async function bootstrap(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  const ObjectId = mongoose.Types.ObjectId;

  ObjectId.prototype.valueOf = function () {
    return this.toString();
  };

  app.enable('trust proxy');
  app.use(helmet());
  app.use(compression());
  app.enableVersioning();
  app.setGlobalPrefix('api');

  app.use(
    express.json({
      limit: '50mb',
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  // Tăng giới hạn kích thước tối đa của JSON payload lên 50MB
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.use(
    rateLimit({
      windowMs: 1 * 60 * 1000,
      max: 3600,
    }),
  );

  const reflector = app.get(Reflector);
  const configService = app.select(SharedModule).get(ApiConfigService);

  app.useGlobalFilters(
    new CustomExceptionFilter(
      configService,
      app.select(SharedModule).get(TranslationService),
    ),
    new UnprocessableEntityFilter(
      reflector,
      configService,
      app.select(SharedModule).get(TranslationService),
    ),
    new UnprocessableEntityExceptionFilter(),
  );

  app.useGlobalInterceptors(
    new TranslationInterceptor(
      app.select(SharedModule).get(TranslationService),
    ),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const formattedErrors = formatErrors(errors);
        return new UnprocessableEntityException(formattedErrors);
      },
    }),
  );

  app.use((req, res, next) => {
    res.setHeader(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate',
    );
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    next();
  });

  app.enableCors({
    origin: configService.acceptedOrigins,
  });

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  app.use(expressCtx);

  if (!configService.isDevelopment) {
    app.enableShutdownHooks();
  }

  const port = configService.appConfig.port;
  await app.listen(port);

  console.info(`server running on ${await app.getUrl()}`);

  return app;
}

function formatErrors(
  errors: ValidationError[],
  parentField: string = '',
): any {
  return errors.reduce((acc, error) => {
    if (error.constraints) {
      const field = parentField
        ? `${parentField}.${error.property}`
        : error.property;
      acc[field] = Object.values(error.constraints);
    }
    if (error.children && error.children.length > 0) {
      const nestedErrors = formatErrors(
        error.children,
        parentField ? `${parentField}.${error.property}` : error.property,
      );
      Object.assign(acc, nestedErrors);
    }
    return acc;
  }, {});
}

bootstrap();
