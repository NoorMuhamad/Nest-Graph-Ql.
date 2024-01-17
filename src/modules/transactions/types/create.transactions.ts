import { Field, InputType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

@Entity()
@InputType()
export class CreateTransactionType {
  @Field(() => String)
  amount: string;

  @Field(() => String)
  paymentMethod: string;
}
