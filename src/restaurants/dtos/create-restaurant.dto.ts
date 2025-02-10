import { ArgsType, Field } from '@nestjs/graphql';
import { IsString, IsBoolean, Length } from 'class-validator';

@ArgsType()
export class CreateRestaurantDto {
  @Field(() => String)
  name: string;

  @Field(() => Boolean)
  @Length(5, 100)
  address: string;
  @Field(() => Boolean)
  @IsBoolean()
  isVegan: boolean;
  @Field(() => String)
  @IsString()
  @Length(5, 10)
  ownerName: string;
}
