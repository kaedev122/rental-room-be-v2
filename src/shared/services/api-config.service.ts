import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get corsOrigins() {
    return this.getString('ACCEPTED_ORIGINS');
  }

  get acceptedOrigins() {
    if (this.isDevelopment) return '*';

    const originFromEnv = this.getString('ACCEPTED_ORIGINS');
    if (!originFromEnv || typeof originFromEnv !== 'string') {
      throw new Error(
        `Could not loaded origin(s) with NodeEnv: ${this.nodeEnv}`,
      );
    }

    return originFromEnv.split(',');
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get fallbackLanguage(): string {
    return this.getString('FALLBACK_LANGUAGE', true);
  }

  get mongodbURI(): string {
    return this.getString('DATABASE_URI');
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get authConfig() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
      refreshTokenExpirationTime: this.getNumber('JWT_REFRESH_EXPIRATION_TIME'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
    };
  }

  getAESKeyConfig() {
    return {
      AESKeyUser: this.getString('AES_KEY_GET_USER'),
    };
  }

  private get(key: string, isNull = false): string {
    const value = this.configService.get<string>(key);

    if (!Boolean(value) && !isNull) {
      throw new Error(key + ' environment variable does not set');
    }

    return value;
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string, isNull = false): string {
    const value = this.get(key, isNull);

    return value?.replace(/\\n/g, '\n');
  }
}
