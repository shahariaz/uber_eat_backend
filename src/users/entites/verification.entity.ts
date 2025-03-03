import { v4 as uuidv4 } from 'uuid';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entites/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Field(() => String)
  @Column({ unique: true })
  code: string;
  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
