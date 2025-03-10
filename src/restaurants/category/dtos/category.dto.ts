import { InputType, Field, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Category } from 'src/restaurants/entities/category.entity';

@InputType()
export class CategoryInput extends PaginationInput {
  @Field(() => String)
  slug: string;
}
@ObjectType()
export class CategoryOutput extends PaginationOutput {
  @Field(() => Category, { nullable: true })
  category?: Category;
}
