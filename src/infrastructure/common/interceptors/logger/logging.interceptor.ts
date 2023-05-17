import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const method = context.switchToHttp().getRequest().method;
    const path = context.switchToHttp().getRequest().url;
    const date = Date.now();

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `Class => ${context.getClass().name} - [${method}] ${path} - ${
              Date.now() - date
            } ms`,
          ),
        ),
      );
  }
}
