import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { Restaurant } from './entities/resturant.entity';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { RestaurantService } from './resturants.services';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Mutation(() => Boolean)
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.createResturant(createRestaurantDto);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
