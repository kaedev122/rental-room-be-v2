import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserEntity, UserSchema } from './../modules/user/user.entity';

import { ApiConfigService } from './../shared/services';
import mongoose from 'mongoose';
import { Document } from 'mongoose';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ApiConfigService],
      useFactory: (configService: ApiConfigService) => ({
        uri: configService.mongodbURI,
      }),
    }),
    MongooseModule.forFeatureAsync([
      { name: UserEntity.name, useFactory: () => UserSchema },
      // {
      //   name: SubOrderItemEntity.name,
      //   imports: [OrderModule],
      //   inject: [OrderLogStatusService],
      //   useFactory: (orderLogService: OrderLogStatusService) => {
      //     const schema = SubOrderItemSchema;

      //     schema.pre(/(updateOne|findOneAndUpdate)/, async function () {
      //       const that = this as unknown as mongoose.Query<unknown, unknown>;
      //       const session = that.getOptions()?.session;
      //       const updateData =
      //         that.getUpdate() as mongoose.UpdateQuery<SubOrderItemEntity>;

      //       await orderLogService.handleUpdateOneOrFindOneAndUpdate(
      //         that,
      //         updateData,
      //         session,
      //       );
      //     });

      //     schema.pre('updateMany', async function () {
      //       const that = this as unknown as mongoose.Query<unknown, unknown>;
      //       const session = that.getOptions()?.session;
      //       const updateData =
      //         that.getUpdate() as mongoose.UpdateQuery<SubOrderItemEntity>;

      //       await orderLogService.handleUpdateMany(that, updateData, session);
      //     });

      //     schema.pre('save', async function () {
      //       const doc = this as SubOrderItemEntity & Document;
      //       const session = doc?.$session();

      //       await orderLogService.handleSave(doc, session);
      //     });

      //     return schema;
      //   },
      // },
    ]),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
