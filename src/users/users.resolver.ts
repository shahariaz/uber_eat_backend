import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './entites/user.entity';
import { UsersService } from './users.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UseGuards, Logger } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';

@Resolver(() => User)
export class UsersResolver {
  private readonly logger = new Logger(UsersResolver.name); // ✅ Use NestJS Logger

  constructor(private readonly userService: UsersService) {}

  @Query(() => Boolean)
  hi(): boolean {
    return true;
  }

  @Mutation(() => CreateAccountOutput)
  async createUser(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      const result = await this.userService.createAccount(createAccountInput);
      return result;
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      return {
        ok: false,
        error: 'Failed to create account. Please try again.',
      };
    }
  }

  @Mutation(() => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const result = await this.userService.login(loginInput);
      return result;
    } catch (error) {
      this.logger.error(`Login error: ${error.message}`);
      return {
        ok: false,
        error: 'Invalid credentials. Please try again.',
      };
    }
  }

  @Query(() => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User): User {
    return authUser;
  }

  @Query(() => UserProfileOutput)
  @UseGuards(AuthGuard)
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.userService.findById(userProfileInput.userId);
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }

      return {
        ok: true,
        user,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      };
    }
  }
}
