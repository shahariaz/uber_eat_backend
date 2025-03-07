import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Category } from './category.entity';

@InputType('resturantInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsString()
  @Length(5, 10)
  name: string;
  @Field(() => String)
  @Column()
  @IsString()
  coverImage: string;
  @Field(() => String)
  @Column()
  @IsString()
  address: string;
  @ManyToOne(() => Category, (category) => category.restaurants)
  @Field(() => Category)
  category: Category;
}
