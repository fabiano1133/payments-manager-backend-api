import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FindUserService } from '../account/find-user.service';
import { UserModule } from '../account/user.module';
import { DatabaseUsersRepository } from 'src/infrastructure/repositories/users-repository/repositories.service';
import { JwtTokenService } from 'src/infrastructure/services/jwt/jwt.service';
import { JwtModule } from 'src/infrastructure/services/jwt/jwt.module';
import { JwtService } from '@nestjs/jwt';
import { BcryptModule } from 'src/infrastructure/services/bcrypt/bcrypt.module';
import { AuthController } from '../../infrastructure/controllers/auth.controller';

@Module({
  imports: [UserModule, JwtModule, BcryptModule],
  controllers: [AuthController],
  exports: [AuthService],
  providers: [
    AuthService,
    FindUserService,
    DatabaseUsersRepository,
    JwtTokenService,
    JwtService,
  ],
})
export class AuthModule {}
