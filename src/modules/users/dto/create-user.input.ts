import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  userName: string;

  @Field()
  password: string;
}
