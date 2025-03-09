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
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';

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
  @Mutation(() => EditRestaurantOutput)
  @Role(['Owner'])
  async editRestaurant(
    @Args('input') editRestaurantInput: EditRestaurantInput,
    @AuthUser() authUser: User,
  ): Promise<EditRestaurantOutput> {
    return await this.restaurantService.editRestaurant(
      authUser,
      editRestaurantInput,
    );
  }
  @Mutation(() => DeleteRestaurantOutput)
  @Role(['Owner'])
  async deleteRestaurant(
    @Args('input') deleteInput: DeleteRestaurantInput,
    @AuthUser() authUser: User,
  ): Promise<DeleteRestaurantOutput> {
    return await this.restaurantService.deleteRestaurant(authUser, deleteInput);
  }
}
