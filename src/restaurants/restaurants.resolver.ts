import { Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from './entities/resturant.entity';

@Resolver(() => Restaurant)
export class RestaurantResolver {
  @Query(() => [Restaurant])
  resturant(): Restaurant[] {
    return [];
  }
}
