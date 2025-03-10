import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Restaurant } from '../entities/resturant.entity';

@InputType()
export class SingleRestaurantInput {
  @Field(() => Number)
  resturantId: number;
}

@ObjectType()
export class SingleRestaurantOutput extends CoreOutput {
  @Field(() => Restaurant, { nullable: true })
  restaurant?: Restaurant;
}
