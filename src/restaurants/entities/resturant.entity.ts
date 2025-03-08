import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { Column, Entity, ManyToOne } from 'typeorm';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Category } from './category.entity';
import { User } from 'src/users/entites/user.entity';

@InputType('ResturantInput', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field(() => String)
  @Column({ unique: true })
  @IsString()
  @Length(5, 50)
  name: string;
  @Field(() => String)
  @Column()
  @IsString()
  coverImage: string;
  @Field(() => String)
  @Column()
  @IsString()
  address: string;
  @ManyToOne(() => Category, (category) => category.restaurants, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Field(() => Category, { nullable: true })
  category: Category;
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.restaurants, { onDelete: 'CASCADE' })
  owner: User;
}
