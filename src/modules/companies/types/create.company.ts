import { Field, InputType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

@Entity()
@InputType()
export class CreateCompanyType {
  @Field(() => String)
  name: string;

  @Field(() => String)
  ownerName: string;

  @Field(() => String)
  cnic: string;

  @Field()
  password: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: string;

  @Field()
  address: string;
}
