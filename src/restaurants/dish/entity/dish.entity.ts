import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString, Length } from 'class-validator';

import { CoreEntity } from 'src/common/entites/core.entity';
import { Restaurant } from 'src/restaurants/entities/resturant.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
@InputType('DishChoiceInputType', { isAbstract: true })
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
}
