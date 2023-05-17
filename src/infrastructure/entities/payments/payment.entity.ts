import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from '../users/user.entity';
import { StatusPayment } from 'src/infrastructure/common/enum/status/status-payments.enum';

@Entity()
export default class Payments {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  category: string;

  @Column({
    type: 'decimal',
  })
  value: number;

  @Column()
  created_at: string;

  @Column()
  payment_date: string;

  @Column()
  status: StatusPayment;

  @ManyToOne(() => User, (user) => user.payments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @JoinTable()
  user_id?: User;
}
