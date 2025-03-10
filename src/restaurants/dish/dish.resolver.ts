import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Dish } from './entity/dish.entity';
import { DishService } from './dish.service';
import { CreateDishInput, CreateDishOutput } from './dto/create-dish.dto';
import { Role } from 'src/auth/role.decorator';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { User } from 'src/users/entites/user.entity';
import { EditDishInput, EditDishOutput } from './dto/edit-dish.dto';
import { DeleteDishInput, DeleteDishOutput } from './dto/delete-dish.dto';

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
  @Mutation(() => EditDishOutput)
  @Role(['Owner'])
  editDish(
    @Args('input') editDishInput: EditDishInput,
    @AuthUser() authUser: User,
  ): Promise<EditDishOutput> {
    return this.dishService.editDish(editDishInput, authUser);
  }
  @Mutation(() => DeleteDishOutput)
  @Role(['Owner'])
  deleteDish(
    @Args('input') deleteDishInput: DeleteDishInput,
    @AuthUser() authUser: User,
  ): Promise<DeleteDishOutput> {
    return this.dishService.deleteDish(deleteDishInput, authUser);
  }
}
