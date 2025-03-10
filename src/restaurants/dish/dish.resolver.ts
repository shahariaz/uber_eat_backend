import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Dish } from './entity/dish.entity';
import { DishService } from './dish.service';
import { CreateDishInput, CreateDishOutput } from './dto/create-dish.dto';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entites/user.entity';

@Resolver(() => Dish)
export class DishResolver {
  constructor(private readonly dishService: DishService) {}
  @Mutation(() => CreateDishOutput)
  @Role(['Owner'])
  createDish(
    @Args('input') createDishInput: CreateDishInput,
    @AuthUser() authUser: User,
  ): Promise<CreateDishOutput> {
    return this.dishService.createDish(createDishInput, authUser);
  }
}
