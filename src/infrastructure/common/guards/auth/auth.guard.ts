import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { JwtTokenService } from 'src/infrastructure/services/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtTokenService: JwtTokenService) {}

  private exceptionService: ExceptionsService = new ExceptionsService();

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const getRequest = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(getRequest);

    if (!token)
      this.exceptionService.UnauthorizedException({
        message: 'Token is missing',
        code_error: 401,
      });

    try {
      const payload = await this.jwtTokenService.verifyAsyncToken(token, {
        secret: process.env.JWT_SECRET,
      });

      getRequest['user'] = payload;
    } catch (error) {
      this.exceptionService.UnauthorizedException({
        message: 'Token Expired or invalid',
        code_error: 401,
      });
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
