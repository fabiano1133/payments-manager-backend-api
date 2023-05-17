import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaymentsRepository } from 'src/domain/repositories/payments-repository.interface';
import Payments from 'src/infrastructure/entities/payments/payment.entity';

@Injectable()
export class DatabasePaymentsRepository implements IPaymentsRepository {
  constructor(
    @InjectRepository(Payments)
    private readonly paymentEntityRepository: Repository<Payments>,
  ) {}
  async insertPayment(payment: Payments): Promise<void> {
    const paymentEntity = this.paymentEntityRepository.create(payment);

    await this.paymentEntityRepository.save(paymentEntity);
  }
}
