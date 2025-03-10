import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Length } from 'class-validator';

import { CoreEntity } from 'src/common/entites/core.entity';
import { Restaurant } from 'src/restaurants/entities/resturant.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { DishChoice } from './dish-choice.entity';

@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
class DishOption {
  @Field(() => String)
  name: string;
  @Field(() => [DishChoice], { nullable: true })
  choices?: DishChoice[];
  @Field(() => Int, { nullable: true })
  extra?: number;
}

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  name: string;
  @Field(() => Int)
  @Column()
  @IsNumber()
  price: number;
  @Field(() => String)
  @Column()
  @IsString()
  imageUlr: string;
  @Field(() => String)
  @Column()
  @Length(10, 255)
  description: string;
  @Field(() => Restaurant)
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.dishes, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;
  @RelationId((dish: Dish) => dish.restaurant)
  resturantId: number;
  @Field(() => [DishOption], { nullable: true })
  @Column({ type: 'json', nullable: true })
  options?: DishOption[];
}
