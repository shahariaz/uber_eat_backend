import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entites/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import { Restaurant } from 'src/restaurants/entities/resturant.entity';
import { Order } from 'src/orders/entities/order.entity';
export enum UserRole {
  Owner = 'Owner',
  Client = 'Client',
  Delivery = 'Delivery',
}
registerEnumType(UserRole, { name: 'UserRole' });
@InputType('UserInput', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field(() => String)
  @Column()
  @IsEmail()
  email: string;
  @Field(() => String, { nullable: true })
  @Column({ select: false })
  @IsString()
  password: string;
  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
  @Field(() => Boolean)
  @Column({ default: false })
  isVerified: boolean;
  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
  @Field(() => [Restaurant])
  restaurants: Restaurant[];
  @OneToMany(() => Order, (order) => order.customer)
  @Field(() => [Order])
  orders: Order[];
  @OneToMany(() => Order, (order) => order.driver)
  @Field(() => [Order])
  riders: Order[];
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.password) {
      try {
        const solt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, solt);
      } catch (error) {
        console.log(error);
        throw new InternalServerErrorException();
      }
    }
  }
  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
