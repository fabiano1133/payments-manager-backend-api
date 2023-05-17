import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import Payments from 'src/infrastructure/entities/payments/payment.entity';

export class CreateUserDTO {
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  created_at?: Date;

  updated_at?: Date;

  isPro?: boolean;

  isActive?: boolean;

  @ValidateNested({ each: true })
  payments?: Payments[];
}
