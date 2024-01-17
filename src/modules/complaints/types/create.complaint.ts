import { Field, InputType } from '@nestjs/graphql';
import { ComplaintStatus } from 'src/enums';
import { Entity } from 'typeorm';

@Entity()
@InputType()
export class CreateComplaintType {
  @Field(() => String)
  subject: string;

  @Field(() => String)
  description: string;

  @Field(() => ComplaintStatus)
  status: ComplaintStatus;
}
