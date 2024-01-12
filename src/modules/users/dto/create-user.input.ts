import { Field, InputType } from '@nestjs/graphql';
import { UserRole } from 'src/enums';
import { Entity } from 'typeorm';

@Entity()
@InputType()
export class CreateUserInput {
  @Field(() => String)
  username: string;

  @Field()
  password: string;

  @Field()
  email: string;

  @Field()
  phoneNumber: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  address: string;
}
