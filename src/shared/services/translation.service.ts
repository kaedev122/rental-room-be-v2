import { Injectable } from '@nestjs/common';
import { isArray, isString, map } from 'lodash';
import type { TranslateOptions } from 'nestjs-i18n';
import { I18nService } from 'nestjs-i18n';

import { AbstractDto } from '../../common/dtos';
import { STATIC_TRANSLATION_DECORATOR_KEY } from '../../decorators/translate.decorator';
import type { ITranslationDecoratorInterface } from '../../interfaces/ITranslationDecoratorInterface';
import { LanguageCode } from './../../constants/language-code';

@Injectable()
export class TranslationService {
  constructor(private i18n: I18nService) {}

  async translate(key: string, options?: TranslateOptions): Promise<string> {
    const lang = options?.lang || LanguageCode.en_US;
    return this.i18n.translate(`${key}`, {
      ...options,
      lang,
    });
  }

  async translateNecessaryKeys<T extends AbstractDto>(dto: T): Promise<T> {
    await Promise.all(
      map(dto, async (value, key) => {
        if (isString(value)) {
          const translateDec: ITranslationDecoratorInterface | undefined =
            Reflect.getMetadata(STATIC_TRANSLATION_DECORATOR_KEY, dto, key);

          if (translateDec) {
            return this.translate(
              `${translateDec.translationKey ?? key}.${value}`,
            );
          }

          return;
        }

        if (value instanceof AbstractDto) {
          return this.translateNecessaryKeys(value);
        }

        if (isArray(value)) {
          return Promise.all(
            map(value, (v: any) => {
              if (v instanceof AbstractDto) {
                return this.translateNecessaryKeys(v);
              }
            }),
          );
        }
      }),
    );

    return dto;
  }
}
