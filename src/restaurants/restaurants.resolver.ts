import { Mutation, Query, Resolver, Args } from '@nestjs/graphql';
import { Restaurant } from './entities/resturant.entity';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  @Query(() => [Restaurant])
  resturant(@Args('veganOnly') veganOnly: boolean): Restaurant[] {
    console.log(veganOnly);
    return [];
  }
  @Mutation(() => Boolean)
  createRestaurant(): boolean {
    return true;
  }
}
