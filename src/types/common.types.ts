export interface SearchCondition {
  status?: string;
  $or?: Array<
    | { name?: { $regex: string; $options: string } }
    | { code?: { $regex: string; $options: string } }
  >;
  $and?: Array<{ [key: string]: any }>;
  $not?: { [key: string]: any };
  $nor?: Array<{ [key: string]: any }>;
  [key: string]: any;
}
