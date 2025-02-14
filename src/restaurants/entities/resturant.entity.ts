import { Field, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number;
  @Field(() => String)
  @IsString()
  @Length(5, 20)
  @Column()
  name: string;
  @Field(() => Boolean, { nullable: true })
  @Column({
    nullable: true,
  })
  isGood: boolean;
  @Field(() => Boolean, { defaultValue: true })
  @Column({
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isVegan: boolean;
  @Field(() => String)
  @Column()
  address: string;
  @Field(() => String)
  @Column()
  ownerName: string;
  @Field(() => String)
  @Column()
  categoryName: string;
}
