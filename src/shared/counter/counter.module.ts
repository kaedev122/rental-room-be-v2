import { Global, Module } from '@nestjs/common';
import { CounterService } from './counter.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CounterEntity, CounterSchema } from './counter.entity';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CounterEntity.name, schema: CounterSchema },
    ]),
  ],
  providers: [CounterService],
  exports: [CounterService],
})
export class CounterModule {}
