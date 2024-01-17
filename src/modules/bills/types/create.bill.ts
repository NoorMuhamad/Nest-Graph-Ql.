import { Field, InputType } from '@nestjs/graphql';
import { BillStatus } from 'src/enums';
import { Entity } from 'typeorm';

@Entity()
@InputType()
export class CreateBillType {
  @Field(() => Date)
  billingDate: Date;

  @Field(() => String)
  totalAmount: string;

  @Field(() => BillStatus)
  status: BillStatus;
}
