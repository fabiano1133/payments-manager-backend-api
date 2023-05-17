import Payments from 'src/infrastructure/entities/payments/payment.entity';

export interface IPaymentsRepository {
  insertPayment(payment: Payments): Promise<void>;
}
