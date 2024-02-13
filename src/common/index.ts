import { Field, ObjectType, Int } from '@nestjs/graphql';
import { Stream } from 'stream';

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
export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Stream;
}
