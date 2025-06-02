import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import * as path from 'path';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { WinstonModule } from './modules/winston/winston.module';
import { RequestedWithMiddleware } from '@shared/middleware';
import { RequestedWithCaptchaMiddleware } from './shared/middleware/captcha-key-middleware';
import { ApiConfigService } from './shared/services';
import { SharedModule } from './shared/shared.module';
// import { LoggerMiddleware } from 'middleware/logger.middleware';

@Module({
  imports: [
    SharedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ApiConfigService) => ({
        fallbackLanguage: configService.fallbackLanguage,
        loaderOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: configService.isDevelopment,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
      imports: [SharedModule],
      inject: [ApiConfigService],
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => {
        const infoDebugRotateFileTransport = new DailyRotateFile({
          level: 'debug',
          filename: `logs/${configService.nodeEnv}/info-debug-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          // maxSize: '20m',
          maxFiles: '14d',
        });

        const errorRotateFileTransport = new DailyRotateFile({
          level: 'error',
          filename: `logs/${configService.nodeEnv}/error-%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          // maxSize: '20m',
          maxFiles: '14d',
        });

        return {
          level: 'debug',
          format: winston.format.combine(
            winston.format.errors({ stack: true }),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, ...meta }) => {
              const metaString =
                meta && Object.keys(meta).length ? JSON.stringify(meta) : '';
              return `[${timestamp}] ${level.toUpperCase()}: ${message} ==> ${metaString}`;
            }),
          ),
          handleExceptions: true,
          // defaultMeta: { service: 'user-service' },
          transports: [
            new winston.transports.Console({
              level: 'silly',
              format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
              ),
            }),
            infoDebugRotateFileTransport,
            errorRotateFileTransport,
          ],
        };
      },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestedWithMiddleware).forRoutes('*');
    consumer
      .apply(RequestedWithCaptchaMiddleware)
      .forRoutes(
        { path: 'v1/auth/login', method: RequestMethod.POST },
      );
  }
}
