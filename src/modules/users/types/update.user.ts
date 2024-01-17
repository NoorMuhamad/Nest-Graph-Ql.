import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateUserType } from './create.user';

@InputType()
export class UpdateUserType extends PartialType(CreateUserType) {
  @Field(() => ID)
  id: string;
}
