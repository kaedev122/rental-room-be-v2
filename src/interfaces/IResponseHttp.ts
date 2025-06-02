import { type SortOrder } from 'mongoose';

export interface ResponseHttp<T> {
  statusCode: number;
  success: boolean;
  message?: string;
  data?: T;
  total?: number;
  totalCount?: number;
  list?: T;
  meta?: IMetaList;
}

export interface IMetaList {
  total?: number;
  currentPage?: number;
  pageSize?: number;
  sortBy?: string;
  order?: SortOrder;
  [k: string]: unknown;
}

export type ResponseHttpCustom<T> = Omit<ResponseHttp<T>, 'statusCode'>;

export interface IResponseException {
  statusCode?: number;
  success?: boolean;
  message?: unknown;
  error?: string;
  [k: string]: unknown;
}

export type ResponseListFunc<T> = Pick<ResponseHttp<T>, 'list' | 'meta'>;
