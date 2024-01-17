import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { PaginatedResponse } from 'src/common';
import { BillStatus } from 'src/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
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
}

@ObjectType()
export class BillResponse extends PaginatedResponse {
  @Field(() => [Bill])
  data: Bill[];
}
