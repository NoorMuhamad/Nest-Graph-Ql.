import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateBillType } from './create.bill';

@InputType()
export class UpdateBillType extends PartialType(CreateBillType) {
  @Field(() => ID)
  id: string;
}
