import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import Payments from '../payments/payment.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Exclude()
  @Column()
  password?: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @Column({ default: false })
  isPro?: boolean;

  @Column({ default: true })
  isActive?: boolean;

  @OneToMany(() => Payments, (payment) => payment.user_id, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'payments',
    joinColumns: [{ name: 'user_id', referencedColumnName: 'id' }],
    inverseJoinColumns: [{ name: 'payment_id', referencedColumnName: 'id' }],
  })
  payments?: Payments[];

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
