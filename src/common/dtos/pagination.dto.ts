import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from './output.dto';
@InputType()
export class PaginationInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number;
  @Field(() => Int, { nullable: true })
  skip?: number;
}
@ObjectType()
export class PaginationOutput extends CoreOutput {
  @Field(() => Int, { nullable: true })
  totalPages?: number;
  @Field(() => Int, { nullable: true })
  totalResults?: number;
  @Field(() => Boolean, { nullable: true })
  hasNextPage?: boolean;
  @Field(() => Boolean, { nullable: true })
  hasPreviousPage?: boolean;
}
