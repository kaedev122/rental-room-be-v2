import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

import { DatabaseEntity } from '../../decorators';
import { DatabaseEntityAbstract } from '@common/abstract.entity';

@Schema()
@DatabaseEntity({ collection: 'counters' }, true)
export class CounterEntity extends DatabaseEntityAbstract {
  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  })
  key: string;

  @Prop({
    default: 0,
  })
  seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(CounterEntity);

export type CounterDocument = HydratedDocument<CounterEntity>;
