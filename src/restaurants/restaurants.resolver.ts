import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { Restaurant } from './entities/resturant.entity';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  @Query(() => [Restaurant])
  resturant(@Args('isGood') isGood: boolean): Restaurant[] {
    console.log(isGood);
    return [];
  }
  @Mutation(() => Boolean)
  createRestaurant(@Args() createRestaurantDto: CreateRestaurantDto): boolean {
    console.log(createRestaurantDto);
    return true;
  }
}
