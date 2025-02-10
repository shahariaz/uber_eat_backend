import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Restaurant {
  @Field(() => String)
  name: string;
  @Field(() => Boolean)
  isGood: boolean;
  @Field(() => Boolean)
  isVegan: boolean;
  @Field(() => String)
  address: string;
  @Field(() => String)
  ownerName: string;
}
