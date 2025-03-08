import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './entites/user.entity';
import { UsersService } from './users.service';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { Role } from 'src/auth/role.decorator';
import { Logger } from '@nestjs/common';

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
      this.logger.error(
        `Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
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
      this.logger.error(
        `Login error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return {
        ok: false,
        error: 'Invalid credentials. Please try again.',
      };
    }
  }

  @Query(() => User)
  @Role(['Any'])
  me(@AuthUser() authUser: User): User {
    return authUser;
  }

  @Query(() => UserProfileOutput)
  @Role(['Any'])
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
  @Role(['Any'])
  @Mutation(() => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input')
    ediProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      await this.userService.editProfile(authUser.id, ediProfileInput);
      return {
        ok: true,
      };
    } catch (error) {
      this.logger.error(
        `Failed to edit profile for user ${authUser.id}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return {
        ok: false,
        error: 'Failed to edit profile. Please try again.',
      };
    }
  }

  @Mutation(() => VerifyEmailOutput)
  async verifyEmail(@Args('input') verifyEmailInput: VerifyEmailInput) {
    try {
      const ok = await this.userService.verifyEmail(verifyEmailInput.code);
      return {
        ok,
      };
    } catch (error) {
      this.logger.error(
        `Failed to verify email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return {
        ok: false,
        error: 'Failed to verify email. Please try again.',
      };
    }
  }
}
