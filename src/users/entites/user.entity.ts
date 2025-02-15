import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity } from 'typeorm';
enum UserRole {
  Owner,
  Client,
  Delivery,
}
registerEnumType(UserRole, { name: 'UserRole' });
@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  @Field(() => String)
  @Column()
  email: string;
  @Field(() => String)
  @Column()
  password: string;
  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;
}
