import { IsDateString, IsEnum, IsString, MaxLength } from 'class-validator';
import User from 'src/infrastructure/entities/users/user.entity';
import { CategoryEnum } from '../enum/category/category.enum';
import { StatusPayment } from '../enum/status/status-payments.enum';

export class CreatePaymentDTO {
  id?: string;

  @IsString({ message: 'Name must be a string' })
  @MaxLength(50, { message: 'Name must be a maximum of 50 characters' })
  name: string;

  @IsString({ message: 'Name must be a string' })
  @MaxLength(200, { message: 'Name must be a maximum of 200 characters' })
  description: string;

  @IsEnum(CategoryEnum, {
    message: `Category must be one of the following values: ${Object.values(
      CategoryEnum,
    )}`,
  })
  category: CategoryEnum;

  status?: StatusPayment.PENDENTE;

  value: number;

  created_at: string;

  @IsDateString()
  payment_date: string;

  user_id?: User;
}
