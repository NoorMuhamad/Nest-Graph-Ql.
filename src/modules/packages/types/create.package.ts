import { Field, InputType } from '@nestjs/graphql';
import { Entity } from 'typeorm';

@Entity()
@InputType()
export class CreatePackageType {
  @Field(() => String)
  name: string;

  @Field(() => Number)
  monthlyFee: number;

  @Field()
  speed: string;

  @Field()
  isActive: true;
}
