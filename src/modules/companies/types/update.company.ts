import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateCompanyType } from './create.company';

@InputType()
export class UpdateCompanyType extends PartialType(CreateCompanyType) {
  @Field(() => ID)
  id: string;
}
