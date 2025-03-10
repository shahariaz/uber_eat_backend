import {
  Field,
  Float,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Dish } from 'src/restaurants/dish/entity/dish.entity';
import { Restaurant } from 'src/restaurants/entities/resturant.entity';
import { User } from 'src/users/entites/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
export enum OrderStatus {
  Pending = 'Pending',
  Cooking = 'Cooking',
  Cooked = 'Cooked',
  PickedUp = 'PickedUp',
  Delivered = 'Delivered',
}
registerEnumType(OrderStatus, { name: 'OrderStatus' });
@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Field(() => User, { nullable: true })
  customer?: User;
  @ManyToOne(() => User, (user) => user.riders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Field(() => User, { nullable: true })
  driver?: User;
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @Field(() => Restaurant)
  restaurant: Restaurant;
  @ManyToMany(() => Dish)
  @JoinTable()
  @Field(() => [Dish])
  dishes: Dish[];
  @Column()
  @Field(() => Float)
  total: number;
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
  @Field(() => OrderStatus)
  status: OrderStatus;
}
