import { Mutation, Resolver, Args } from '@nestjs/graphql';
import { Restaurant } from './entities/resturant.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { RestaurantService } from './resturants.services';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entites/user.entity';
import { Role } from 'src/auth/role.decorator';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) {}
  @Mutation(() => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return await this.restaurantService.createResturant(
      authUser,
      createRestaurantInput,
    );
  }
}
