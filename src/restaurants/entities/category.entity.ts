import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Restaurant } from './resturant.entity';
import { IsString } from 'class-validator';
@InputType('CategoryInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
  @Column({ unique: true })
  @Field(() => String)
  @IsString()
  name: string;
  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  @IsString()
  coverImage: string;
  @Field(() => String)
  @Column({ unique: true })
  slug: string;
  @OneToMany(() => Restaurant, (restaurant) => restaurant.category)
  @Field(() => [Restaurant])
  restaurants: Restaurant[];
}
