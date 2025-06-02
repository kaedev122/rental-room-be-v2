/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { Schema } from 'mongoose';

import type { DatabaseEntityAbstract } from '../abstract.entity';

export class AbstractDto {
  @ApiProperty()
  _id: Schema.Types.ObjectId;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  translations?: AbstractTranslationDto[];

  constructor(
    _entity: DatabaseEntityAbstract,
    _options?: { excludeFields?: boolean },
  ) {
    // const languageCode = ContextProvider.getLanguage();
    // if (languageCode && entity.translations) {
    //   const translationEntity = entity.translations.find(
    //     (titleTranslation) => titleTranslation.languageCode === languageCode,
    //   )!;
    //   const fields: Record<string, string> = {};
    //   for (const key of Object.keys(translationEntity)) {
    //     const metadata = Reflect.getMetadata(
    //       DYNAMIC_TRANSLATION_DECORATOR_KEY,
    //       this,
    //       key,
    //     );
    //     if (metadata) {
    //       fields[key] = translationEntity[key];
    //     }
    //   }
    //   Object.assign(this, fields);
    // } else {
    //   this.translations = entity.translations?.toDtos();
    // }
  }
}

export class AbstractTranslationDto extends AbstractDto {
  constructor(entity: DatabaseEntityAbstract) {
    super(entity, { excludeFields: true });
  }
}
