import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  new (...args: any[]): NonNullable<unknown>;
}

export const Serialize = (dto: ClassConstructor) => {
  return UseInterceptors(new SerializeInterceptor(dto));
};

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}
  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a request is handled
    // by the request handler
    console.log(`I'm running before the handler`);
    return handler.handle().pipe(
      map((data: ClassConstructor) => {
        // Run something before the response is sent out
        console.log(`I'm running before the response is sent out`);
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
