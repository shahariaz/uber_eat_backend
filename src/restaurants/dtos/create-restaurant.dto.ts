import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';

import { Restaurant } from '../entities/resturant.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class CreateRestaurantInput extends PickType(
  Restaurant,
  ['name', 'address', 'coverImage'],
  InputType,
) {
  @Field(() => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
