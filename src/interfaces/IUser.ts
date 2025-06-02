import { Types } from 'mongoose';

export interface ICreatedBy {
  email: string;
  code: string;
  fullName: string;
  _id: Types.ObjectId;
}
