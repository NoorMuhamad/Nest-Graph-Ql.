import { Field, InputType } from '@nestjs/graphql';
import { UserRole } from 'src/enums';
import { Entity } from 'typeorm';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { FileUpload } from 'src/common';

@Entity()
@InputType()
export class CreateUserType {
  @Field(() => String)
  firstName: string;

  @Field(() => String)
  lastName: string;

  @Field(() => String)
  cnic: string;

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

  @Field(() => GraphQLUpload)
  image: Promise<FileUpload>;
}
