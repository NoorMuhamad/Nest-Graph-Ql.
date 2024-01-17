import { Field, InputType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

@Entity()
@InputType()
export class CreateCustomerType {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field()
  email: string;

  @Field()
  address: string;

  @Field()
  phoneNumber: string;
}
