import {
  Field,
  InputType,
  Int,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { Dish } from '../entity/dish.entity';
import { CoreOutput } from 'src/common/dtos/output.dto';

@InputType()
export class EditDishInput extends PickType(PartialType(Dish), [
  'name',
  'options',
  'price',
  'description',
]) {
  @Field(() => Int)
  dishId: number;
}
@ObjectType()
export class EditDishOutput extends CoreOutput {}
