import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './entites/user.entity';
import { UsersService } from './users.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';

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
      const [ok, error] =
        await this.userService.createAccount(createAccountInput);
      return {
        ok,
        error,
      };
    } catch (error) {
      return {
        ok: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        error: error,
      };
    }
  }
  @Mutation(() => LoginOutput)
  async Login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const [ok, error, token] = await this.userService.login(loginInput);
      return {
        ok,
        error,
        token,
      };
    } catch (error: any) {
      return {
        ok: false,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        error: error.message,
      };
    }
  }
}
