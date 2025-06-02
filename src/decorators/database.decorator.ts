import type { SchemaOptions } from '@nestjs/mongoose';
import { Schema } from '@nestjs/mongoose';

import {
  DATABASE_CREATED_AT_FIELD_NAME,
  DATABASE_UPDATED_AT_FIELD_NAME,
} from './../constants';

export function DatabaseEntity(
  options?: SchemaOptions,
  isIgnoreTimestamp = false,
): ClassDecorator {
  const resultObj: SchemaOptions = {
    ...options,
    versionKey: false,
    timestamps: {
      createdAt: DATABASE_CREATED_AT_FIELD_NAME,
      updatedAt: DATABASE_UPDATED_AT_FIELD_NAME,
    },
  };

  if (isIgnoreTimestamp) {
    resultObj.timestamps = false;
  }

  return Schema(resultObj);
}
