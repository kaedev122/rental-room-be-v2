import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CounterEntity } from './counter.entity';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class CounterService {
  constructor(
    @InjectModel(CounterEntity.name) private counterModel: Model<CounterEntity>,
  ) {}

  public async increaseCounterNumber(
    counterKey: string,
    seq = 1,
    session?: mongoose.mongo.ClientSession,
  ): Promise<number> {
    const counterUpdated = await this.counterModel.findOneAndUpdate(
      {
        key: counterKey,
      },
      { $inc: { seq } },
      {
        new: true,
        lean: true,
        returnOriginal: false,
        upsert: true,
        projection: { seq: 1 },
        session,
      },
    );

    return counterUpdated.seq;
  }

  public async increaseCounterNumberWithSeq(
    counterKey: string,
    seq = 1,
    session?: mongoose.mongo.ClientSession,
  ): Promise<number> {
    const counterUpdated = await this.counterModel.findOneAndUpdate(
      {
        key: counterKey,
      },
      { $inc: { seq }, updatedAt: new Date() },
      {
        new: true,
        lean: true,
        returnOriginal: false,
        upsert: true,
        projection: { seq: 1 },
        session,
      },
    );

    return counterUpdated.seq;
  }
}
