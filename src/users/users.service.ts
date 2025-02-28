import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateAccountInput } from './dtos/create-account.dto';
import { JwtService } from '../jwt/jwt.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  // Refactored method to avoid duplication in logic
  private async findUserByEmail(email: string): Promise<User | null> {
    return this.users.findOne({ where: { email } });
  }

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const isUserExist = await this.findUserByEmail(email);
      if (isUserExist) {
        return { ok: false, error: 'There is already a user with that email' };
      }
      const newUser = this.users.create({ email, password, role });
      await this.users.save(newUser);
      return { ok: true };
    } catch (error) {
      this.logger.error(
        `Failed to create account: ${error.message}`,
        error.stack,
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
      const user = await this.findUserByEmail(email);
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
        `Login failed for user ${email}: ${error.message}`,
        error.stack,
      );
      return { ok: false, error: "Couldn't log user in" };
    }
  }

  async findById(id: number): Promise<User> {
    const user = await this.users.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }
}
