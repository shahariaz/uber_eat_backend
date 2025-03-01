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
import { IsEmail, IsEnum, IsString } from 'class-validator';
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
  @IsEmail()
  email: string;
  @Field(() => String)
  @Column()
  @IsString()
  password: string;
  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
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
  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
