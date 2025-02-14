import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entites/core.entity';
import { Column, Entity } from 'typeorm';
type UserRole = 'client' | 'owner' | 'delivery';
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
  @Field(() => String)
  @Column()
  role: UserRole;
}
