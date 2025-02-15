import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './entites/user.entity';
import { UsersService } from './users.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { error } from 'console';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}
  @Query(() => Boolean)
  hi() {
    return true;
  }
  @Mutation(() => CreateAccountOutput)
  async createUser(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const result = await this.userService.createAccount(createAccountInput);
      if (result) {
        return {
          ok: false,
          error: result,
        };
      }
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        error: error,
      };
    }
  }
}
