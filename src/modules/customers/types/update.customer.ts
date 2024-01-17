import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateCustomerType } from './create.customer';

@InputType()
export class UpdateCustomerType extends PartialType(CreateCustomerType) {
  @Field(() => ID)
  id: string;
}
