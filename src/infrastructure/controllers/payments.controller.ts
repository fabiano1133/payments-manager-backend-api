import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { CreatePaymentService } from '../../use-cases/payments/create-payment.service';
import { CreatePaymentDTO } from 'src/infrastructure/common/DTOs/create-payment.dto';
import { LoggerService } from 'src/infrastructure/logger/logger.service';
import { ExceptionsService } from 'src/infrastructure/exceptions/exceptions.service';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import { Request } from 'express';

@Controller('api/v1/payments')
export class PaymentsController {
  private loggerService: LoggerService = new LoggerService();
  private exceptionService: ExceptionsService = new ExceptionsService();

  constructor(private readonly createPaymentService: CreatePaymentService) {}

  @UseGuards(AuthGuard)
  @Post('create-payment')
  async handleCreatePayment(
    @Body() paymentDto: CreatePaymentDTO,
    @Req() req: Request,
  ): Promise<void> {
    try {
      const id = req['user'].sub;
      await this.createPaymentService.execute(paymentDto, id);
      this.loggerService.log(
        `${PaymentsController.name}`,
        '[PAYMENT RECEIVED]',
      );
    } catch (error) {
      this.loggerService.error(
        `${PaymentsController.name}`,
        `${error.message}`,
      );
      this.exceptionService.badRequestException({
        message: `${error.message}`,
      });
    }
  }
}
