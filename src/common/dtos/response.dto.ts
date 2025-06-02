import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty()
  readonly success: boolean;

  @ApiPropertyOptional()
  readonly data?: unknown;

  @ApiPropertyOptional()
  readonly message?: string;

  @ApiPropertyOptional()
  readonly total?: number;

  @ApiPropertyOptional()
  readonly totalCount?: number;

  constructor(
    success: boolean,
    data: unknown,
    message?: string,
    total?: number,
    totalCount?: number,
  ) {
    this.data = data;
    this.success = success;
    this.message = message;
    this.total = total;
    this.totalCount = totalCount;
  }
}

export class ResponseOrderListDto extends ResponseDto {
  @ApiPropertyOptional()
  readonly tikTokTotal?: number;

  @ApiPropertyOptional()
  readonly basicTotal?: number;

  @ApiPropertyOptional()
  readonly rushOrderTotal?: number;

  @ApiPropertyOptional()
  readonly qrErrorCount?: number;

  constructor(
    data: unknown,
    success: boolean,
    message: string,
    total: number,
    basicTotal: number,
    tikTokTotal: number,
  ) {
    super(success, data, message, total);
    this.basicTotal = basicTotal;
    this.tikTokTotal = tikTokTotal;
  }
}

export class ResponseCustomDto<T> {
  @ApiProperty()
  readonly success: boolean;

  @ApiPropertyOptional({
    type: 'object',
    additionalProperties: true
  })
  readonly data?: T;

  @ApiPropertyOptional()
  readonly message?: string;

  @ApiPropertyOptional()
  readonly total?: number;

  @ApiPropertyOptional()
  readonly totalCount?: number;

  constructor(
    success: boolean,
    data: T,
    message?: string,
    total?: number,
    totalCount?: number,
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.total = total;
    this.totalCount = totalCount;
  }
}

export class ResponseSubBarcodeDto extends ResponseDto {
  @ApiPropertyOptional()
  totalStatus?: Record<string, string>;
}
export class ResponseProductTypeListApiDto extends ResponseDto {
  @ApiPropertyOptional()
  readonly current?: number;

  @ApiPropertyOptional()
  readonly pageSize?: number;

  @ApiPropertyOptional()
  readonly totalPage?: number;

  constructor(
    data: unknown,
    success: boolean,
    message: string,
    total: number,
    current: number,
    pageSize: number,
    totalPage: number,
  ) {
    super(success, data, message, total);
    this.current = current;
    this.pageSize = pageSize;
    this.totalPage = totalPage;
  }
}

export class ResponseImportSubBarcodeDto extends ResponseDto {
  @ApiPropertyOptional()
  errorSub?: Array<Record<string, string>>;
}
