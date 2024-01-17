import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common';
import { BillStatus } from 'src/enums';
import { Customer } from 'src/modules/customers/entities/customer.entity';
import { Transaction } from 'src/modules/transactions/entities/transactions.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

registerEnumType(BillStatus, {
  name: 'BillStatus',
});

@ObjectType()
@Entity()
export class Bill {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  billingDate: Date;

  @Field()
  @Column()
  totalAmount: string;

  @Field(() => BillStatus)
  @Column({
    type: 'enum',
    enum: BillStatus,
  })
  status: BillStatus;

  @Field({ nullable: true })
  @CreateDateColumn()
  createdAt?: Date;

  @Field({ nullable: true })
  @UpdateDateColumn()
  updatedAt?: Date;

  @ManyToOne(() => Customer)
  @JoinColumn()
  @Field(() => Customer)
  customer: Customer;

  @OneToOne(() => Transaction, (transaction) => transaction.bill)
  @JoinColumn()
  @Field(() => Transaction)
  billTransaction: Transaction;
}

@ObjectType()
export class BillResponse extends PaginatedResponse {
  @Field(() => [Bill])
  data: Bill[];
}
