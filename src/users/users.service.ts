import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateAccountInput } from './dtos/create-account.dto';
import { JwtService } from '../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { Verification } from './entites/verification.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verfication: Repository<Verification>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  // Refactored method to avoid duplication in logic
  private async findUserByEmail(
    email: string,
    select: boolean,
  ): Promise<User | null> {
    return this.users.findOne({
      where: { email },
      select: select ? ['id', 'password'] : undefined,
    });
  }

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const isUserExist = await this.findUserByEmail(email, true);

      if (isUserExist) {
        return { ok: false, error: 'There is already a user with that email' };
      }
      const newUser = this.users.create({ email, password, role });
      await this.users.save(newUser);
      const verification = this.verfication.create({ user: newUser });
      const presistedVerificatio = await this.verfication.save(verification);
      await this.mailService.sendVerificationEmail(
        newUser.email,
        presistedVerificatio.code,
      );
      return { ok: true };
    } catch (error) {
      this.logger.error(
        `Failed to create account: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      return { ok: false, error: "Couldn't create account" };
    }
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const user = await this.findUserByEmail(email, true);
      if (!user) {
        return { ok: false, error: 'User not found' };
      }

      const isPasswordValid = await user.checkPassword(password);
      if (!isPasswordValid) {
        return { ok: false, error: 'Wrong password' };
      }

      const payload = { id: user.id };
      const secretKey = this.configService.get<string>('SECRET_KEY');
      const expiresIn = this.configService.get<string>('EXPIRES_IN');

      if (!secretKey || !expiresIn) {
        return {
          ok: false,
          error: 'JWT secret key or expiration is not defined',
        };
      }

      const accessToken = this.jwtService.sign(payload); // rely on JwtService
      return { ok: true, token: accessToken };
    } catch (error) {
      this.logger.error(
        `Login failed for user ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error instanceof Error ? error.stack : undefined,
      );
      return { ok: false, error: "Couldn't log user in" };
    }
  }

  async findById(id: number): Promise<User> {
    const user = await this.users.findOne({ where: { id } });

    if (!user) {
      const errorMessage = `User with id ${id} not found`;
      this.logger.error(errorMessage);
      throw new NotFoundException(errorMessage);
    }

    return user;
  }

  async editProfile(userId: number, { email, password }: EditProfileInput) {
    const user = await this.users.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    if (email) {
      user.email = email;
      user.isVerified = false;
      const verification = this.verfication.create({ user });
      await this.verfication.save(verification);
      await this.mailService.sendVerificationEmail(
        user.email,
        verification.code,
      );
    }
    if (password) {
      user.password = password;
    }
    return this.users.save(user);
  }
  async verifyEmail(code: string): Promise<boolean> {
    const verification = await this.verfication.findOne({
      where: { code },
      relations: ['user'],
    });

    if (verification) {
      verification.user.isVerified = true;
      await this.users.save(verification.user);
      await this.verfication.delete(verification.id);
      return true;
    }
    return false;
  }
}
