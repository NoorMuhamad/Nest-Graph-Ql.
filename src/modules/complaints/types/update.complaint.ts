import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreateComplaintType } from './create.complaint';

@InputType()
export class UpdateComplaintType extends PartialType(CreateComplaintType) {
  @Field(() => ID)
  id: string;
}
