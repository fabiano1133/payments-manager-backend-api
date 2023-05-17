import { RefreshTokenDTO } from 'src/infrastructure/common/DTOs/request-refreshToken.dto';

export interface IJwtServicePayload {
  sub: string;
  email: string;
}

export interface IJwtService {
  sign(payload: IJwtServicePayload, secret: string, expiresIn: string): string;

  verifyAsyncToken(token: string, secret: string): Promise<any>;
  decoded(refreshToken: RefreshTokenDTO): Promise<any>;
}
