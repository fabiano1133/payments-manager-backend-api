import { Inject, Injectable } from '@nestjs/common';
import { JwtTokenService } from 'src/infrastructure/services/jwt/jwt.service';
import { BcryptService } from 'src/infrastructure/services/bcrypt/bcrypt.service';
import { DatabaseUsersRepository } from 'src/infrastructure/repositories/users-repository/repositories.service';
import { SigninDTO } from 'src/infrastructure/common/DTOs/signin.dto';
import { IUsersRepository } from 'src/domain/repositories/users-repository.interface';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { IJwtServicePayload } from 'src/domain/adapters/jwt.interface';

@Injectable()
export class AuthService {
  private loggerService: LoggerService = new LoggerService();
  private exceptionsService: ExceptionsService = new ExceptionsService();

  constructor(
    @Inject(DatabaseUsersRepository)
    private usersRepository: IUsersRepository,
    @Inject(JwtTokenService)
    private jwtTokenService: JwtTokenService,
    @Inject(BcryptService)
    private bcryptService: BcryptService,
  ) {}

  async signin(signinDto: SigninDTO) {
    try {
      const user = await this.usersRepository.findUserByEmail(signinDto.email);

      if (!user) {
        this.exceptionsService.badRequestException({
          message: `Email or Password Incorrect`,
        });
      }

      const passwordMatch = await this.bcryptService.comparePassword(
        signinDto.password,
        user.password,
      );

      if (!passwordMatch) {
        this.exceptionsService.badRequestException({
          message: `Email or Password Incorrect`,
        });
      }
      const payload: IJwtServicePayload = {
        sub: user.id,
        email: user.email,
      };

      const token = this.jwtTokenService.sign(
        payload,
        process.env.JWT_SECRET,
        process.env.JWT_EXPIRES_IN,
      );

      const response = {
        email: user.email,
        token: token,
      };

      return response;
    } catch (error) {
      this.loggerService.error(`${AuthService.name}`, `${error.message}`);
      this.exceptionsService.badRequestException({
        message: `${error.message}`,
      });
    }
  }
}
