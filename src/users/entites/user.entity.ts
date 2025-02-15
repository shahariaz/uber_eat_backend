import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entites/core.entity';
import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
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
  @BeforeInsert()
  async hashPassword(): Promise<void> {
    try {
      const solt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, solt);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
