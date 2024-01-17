import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { CreatePackageType } from './create.package';

@InputType()
export class UpdatePackageType extends PartialType(CreatePackageType) {
  @Field(() => ID)
  id: string;
}
