import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PaginationOutput,
} from 'src/common/dtos/pagination.dto';
import { Restaurant } from '../entities/resturant.entity';

@InputType()
export class RestaurantInput extends PaginationInput {}

@ObjectType()
export class RestaurantOutput extends PaginationOutput {
  @Field(() => [Restaurant], { nullable: true })
  restaurants?: Restaurant[];
}
