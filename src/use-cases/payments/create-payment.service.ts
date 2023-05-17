import { Inject, Injectable } from '@nestjs/common';
import { IPaymentsRepository } from 'src/domain/repositories/payments-repository.interface';
import { IUsersRepository } from 'src/domain/repositories/users-repository.interface';
import { CreatePaymentDTO } from 'src/infrastructure/common/DTOs/create-payment.dto';
import { StatusPayment } from 'src/infrastructure/common/enum/status/status-payments.enum';
import User from 'src/infrastructure/entities/users/user.entity';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { DatabasePaymentsRepository } from 'src/infrastructure/repositories/payments-repository/payments-repository.service';
import { DatabaseUsersRepository } from 'src/infrastructure/repositories/users-repository/repositories.service';

@Injectable()
export class CreatePaymentService {
  private loggerService: LoggerService = new LoggerService();
  private exceptionsService: ExceptionsService = new ExceptionsService();

  constructor(
    @Inject(DatabasePaymentsRepository)
    private readonly paymentsRepository: IPaymentsRepository,
    @Inject(DatabaseUsersRepository)
    private usersRepository: IUsersRepository,
  ) {}

  async execute(payment: CreatePaymentDTO, user_id: User): Promise<void> {
    try {
      const user = await this.usersRepository.findUser(user_id.id);

      if (!user.isPro) {
        const quantityPayments = user.payments.length + 1;
        if (quantityPayments > 5) {
          this.exceptionsService.badRequestException({
            message: `You have reached the limit of ${
              quantityPayments - 1
            } payments! You can increase your limit by becoming a PRO user!`,
          });
        }
      }

      const paymentCreated = {
        ...payment,
        created_at: new Date().toLocaleDateString('pt-BR', {
          timeZone: 'UTC',
          dateStyle: 'short',
        }),
        payment_date: new Date(payment.payment_date).toLocaleDateString(
          'pt-BR',
          {
            timeZone: 'UTC',
            dateStyle: 'short',
          },
        ),
        status: StatusPayment.PENDENTE,
        user_id: user_id,
      };

      await this.paymentsRepository.insertPayment(paymentCreated);
      this.loggerService.log(
        `${CreatePaymentService.name}`,
        `${JSON.stringify(paymentCreated)}`,
      );
    } catch (error) {
      this.loggerService.error(
        `${CreatePaymentService.name}`,
        `${error.message}`,
      );
      this.exceptionsService.badRequestException({
        message: `${error.message}`,
      });
    }
  }
}
