import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { type Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ResponseHttp } from '@interfaces/IResponseHttp';

@Injectable()
export class ResponseHttpInterceptor<T>
  implements NestInterceptor<T, ResponseHttp<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseHttp<T>> {
    return next.handle().pipe(
      map((data) => ({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        statusCode: context.switchToHttp().getResponse().statusCode as number,
        ...data,
      })),
    );
  }
}
