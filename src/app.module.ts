import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { DataSource } from 'typeorm';
import { UserModule } from './use-cases/account/user.module';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { TypeormModuleConfigModule } from './infrastructure/config/typeorm/typeorm.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { RepositoriesModule } from './infrastructure/repositories/repositories.module';
import { DatabaseUsersRepository } from './infrastructure/repositories/users-repository/repositories.service';
import { FindUserService } from './use-cases/account/find-user.service';
import { BcryptModule } from './infrastructure/services/bcrypt/bcrypt.module';
import { JwtModule as JwtModuleService } from './infrastructure/services/jwt/jwt.module';
import { JwtTokenService } from './infrastructure/services/jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './use-cases/auth/auth.module';
import { AuthService } from './use-cases/auth/auth.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './infrastructure/common/interceptors/logger/logging.interceptor';
import { PaymentsModule } from './use-cases/payments/payments.module';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    UserModule,
    EnvironmentConfigModule,
    TypeormModuleConfigModule,
    LoggerModule,
    ExceptionsModule,
    RepositoriesModule,
    BcryptModule,
    JwtModuleService,
    AuthModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [
    DatabaseUsersRepository,
    FindUserService,
    JwtTokenService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
