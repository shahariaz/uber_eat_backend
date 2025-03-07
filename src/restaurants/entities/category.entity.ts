import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Restaurant } from './resturant.entity';
import { IsString } from 'class-validator';
@InputType('categoryInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Column()
  @Field(() => String)
  @IsString()
  name: string;

  @Field(() => String)
  @Column()
  @IsString()
  coverImage: string;
  @OneToMany(() => Restaurant, (restaurant) => restaurant.category)
  @Field(() => [Restaurant])
  restaurants: Restaurant[];
}
