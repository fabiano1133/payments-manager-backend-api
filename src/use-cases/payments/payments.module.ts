import { Module } from '@nestjs/common';
import { CreatePaymentService } from './create-payment.service';
import { PaymentsController } from '../../infrastructure/controllers/payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Payments from 'src/infrastructure/entities/payments/payment.entity';
import { DatabasePaymentsRepository } from 'src/infrastructure/repositories/payments-repository/payments-repository.service';
import { DatabaseUsersRepository } from 'src/infrastructure/repositories/users-repository/repositories.service';
import { UserModule } from '../account/user.module';
import { JwtModule } from 'src/infrastructure/services/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payments]), UserModule, JwtModule],
  providers: [
    CreatePaymentService,
    DatabasePaymentsRepository,
    DatabaseUsersRepository,
  ],
  controllers: [PaymentsController],
  exports: [TypeOrmModule],
})
export class PaymentsModule {}
