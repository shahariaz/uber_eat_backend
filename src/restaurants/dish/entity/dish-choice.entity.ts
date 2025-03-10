import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';

@InputType('DishChoiceInputType', { isAbstract: true }) // 👈 Avoid duplicate names
@ObjectType()
export class DishChoice {
  @Field(() => String)
  name: string;

  @Field(() => Int, { nullable: true })
  extra?: number;
}
