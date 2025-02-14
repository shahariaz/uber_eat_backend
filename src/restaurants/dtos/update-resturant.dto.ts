import { Field, InputType, PartialType } from '@nestjs/graphql';

import { CreateRestaurantDto } from './create-restaurant.dto';

@InputType()
export class UpdateResturantInputType extends PartialType(
  CreateRestaurantDto,
) {}
@InputType()
export class UpdateRestaurantDto {
  @Field(() => Number)
  id: number;
  @Field(() => UpdateResturantInputType)
  data: UpdateResturantInputType;
}
