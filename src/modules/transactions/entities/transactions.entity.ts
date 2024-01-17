import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common';
import { Bill } from 'src/modules/bills/entities/bill.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Transaction {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  amount: string;

  @Field()
  @Column()
  paymentMethod: string;

  @Field({ nullable: true })
  @CreateDateColumn()
  createdAt?: Date;

  @Field({ nullable: true })
  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToOne(() => Bill, (bill) => bill.billTransaction)
  @JoinColumn()
  @Field(() => Bill)
  bill: Bill;
}

@ObjectType()
export class TransactionResponse extends PaginatedResponse {
  @Field(() => [Transaction])
  data: Transaction[];
}
