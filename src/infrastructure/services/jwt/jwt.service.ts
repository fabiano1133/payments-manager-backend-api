import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IJwtService,
  IJwtServicePayload,
} from 'src/domain/adapters/jwt.interface';
import { RefreshTokenDTO } from 'src/infrastructure/common/DTOs/request-refreshToken.dto';

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(private readonly jwtService: JwtService) {}

  async verifyAsyncToken(token: string, secret: any): Promise<any> {
    const verifiedToken = await this.jwtService.verifyAsync(token, secret);
    return verifiedToken;
  }

  sign(payload: IJwtServicePayload, secret: string, expiresIn: string): string {
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }
  async decoded(refresh_token: RefreshTokenDTO): Promise<any> {
    const decoded = this.jwtService.decode(refresh_token.refresh_token);
    return decoded;
  }
}
