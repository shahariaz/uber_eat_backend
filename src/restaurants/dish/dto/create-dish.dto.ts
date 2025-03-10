import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
@InputType()
export class DishOptionInput {
  @Field(() => String)
  name: string;
  @Field(() => [String], { nullable: true })
  choices?: string[];
  @Field(() => Int, { nullable: true })
  extra?: number;
}

@InputType()
export class CreateDishInput {
  @Field(() => String)
  name: string;
  @Field(() => Int)
  restaurantId: number;
  @Field(() => Int)
  price: number;
  @Field(() => String)
  imageUlr: string;
  @Field(() => String)
  description: string;
  @Field(() => [DishOptionInput], { nullable: true })
  options?: DishOptionInput[];
}

@ObjectType()
export class CreateDishOutput extends CoreOutput {}
