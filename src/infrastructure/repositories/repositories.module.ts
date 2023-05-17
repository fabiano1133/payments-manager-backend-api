import { Module } from '@nestjs/common';
import { DatabaseUsersRepository } from './users-repository/repositories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../entities/users/user.entity';
import { TypeormModuleConfigModule } from '../config/typeorm/typeorm.module';
import Payments from '../entities/payments/payment.entity';
import { DatabasePaymentsRepository } from './payments-repository/payments-repository.service';

@Module({
  imports: [
    TypeormModuleConfigModule,
    TypeOrmModule.forFeature([User, Payments]),
  ],
  exports: [DatabaseUsersRepository, DatabasePaymentsRepository],
  providers: [DatabaseUsersRepository, DatabasePaymentsRepository],
})
export class RepositoriesModule {}
