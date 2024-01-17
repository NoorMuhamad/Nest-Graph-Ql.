import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class PaginatedResponse {
  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  currentPage: number;
}

@ObjectType()
export class BaseResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}
