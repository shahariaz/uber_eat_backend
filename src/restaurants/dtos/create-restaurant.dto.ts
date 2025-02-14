import { InputType, OmitType } from '@nestjs/graphql';

import { Restaurant } from '../entities/resturant.entity';

@InputType()
export class CreateRestaurantDto extends OmitType(
  Restaurant,
  ['id'],
  InputType,
) {}
