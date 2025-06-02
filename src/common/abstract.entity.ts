/* eslint-disable max-classes-per-file */
import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

import {
  DATABASE_CREATED_AT_FIELD_NAME,
  DATABASE_CREATED_BY_FIELD_NAME,
  DATABASE_DELETED_AT_FIELD_NAME,
  DATABASE_IS_DELETED_AT_FIELD_NAME,
  DATABASE_UPDATED_AT_FIELD_NAME,
  DATABASE_UPDATED_BY_FIELD_NAME,
} from '../constants';

export abstract class DatabaseEntityAbstract {
  @Prop({
    type: Types.ObjectId,
    default: () => new Types.ObjectId(),
    // get: (v: Types.ObjectId) => (v ? v.toString() : v),
  })
  _id: Types.ObjectId;

  @Prop({
    required: false,
    index: true,
    type: new Object({
      _id: Types.ObjectId,
      email: String,
      code: String,
      fullName: String,
    }),
  })
  [DATABASE_CREATED_BY_FIELD_NAME]?: Record<string, unknown>;

  @Prop({
    required: false,
    index: 'desc',
    type: new Object({
      _id: Types.ObjectId,
      email: String,
      code: String,
      fullName: String,
    }),
  })
  [DATABASE_UPDATED_BY_FIELD_NAME]?: Record<string, unknown>;

  // @Prop({
  //   required: false,
  //   index: 'desc',
  //   type: Date,
  // })
  // [DATABASE_UPDATED_AT_FIELD_NAME]?: Date;

  @Prop({
    required: false,
    index: true,
    type: Date,
  })
  [DATABASE_DELETED_AT_FIELD_NAME]?: Date;

  @Prop({
    required: true,
    default: Date.now,
    index: 'asc',
    type: Date,
  })
  [DATABASE_CREATED_AT_FIELD_NAME]?: Date;

  @Prop({
    required: false,
    default: Date.now,
    index: 'desc',
    type: Date,
  })
  [DATABASE_UPDATED_AT_FIELD_NAME]?: Date;

  @Prop({
    required: true,
    default: false,
    index: false,
    type: Boolean,
  })
  [DATABASE_IS_DELETED_AT_FIELD_NAME]?: boolean;
}
