import { Module } from '@nestjs/common';
import { EnvironmentConfigService } from '../environment-config/environment-config.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import User from 'src/infrastructure/entities/users/user.entity';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import Payments from 'src/infrastructure/entities/payments/payment.entity';

export const getTypeOrmModuleOptions = (
  config: EnvironmentConfigService,
): TypeOrmModuleOptions =>
  ({
    type: 'postgres',
    host: config.getDatabaseHost(),
    port: config.getDatabasePort(),
    username: config.getDatabaseUser(),
    password: config.getDatabasePassword(),
    database: config.getDatabaseName(),
    entities: [User, Payments], //__dirname + './../../**/*.entity{.ts,.js}'
    synchronize: config.getDatabaseSync(),
    //schema: config.getDatabaseSchema(),
    // ssl: {
    //   rejectUnauthorized: false,
    // },
  } as TypeOrmModuleOptions);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: getTypeOrmModuleOptions,
    }),
  ],
})
export class TypeormModuleConfigModule {}
