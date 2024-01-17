import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateTransactionType } from './create.transactions';

@InputType()
export class UpdateTransactionType extends PartialType(CreateTransactionType) {
  @Field(() => ID)
  id: string;
}
