import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dtos/create-account.dto';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '../jwt/jwt.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<[boolean, string?]> {
    try {
      const isUserExist = await this.users.findOne({
        where: { email },
      });
      if (isUserExist) {
        return [false, 'There is a user with that email already'];
      }
      await this.users.save(this.users.create({ email, password, role }));
      return [true];
    } catch (e) {
      console.log(e);
      return [false, "Couldn't create account"];
    }
  }
  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<[ok: boolean, error?: string, token?: string]> {
    try {
      const user = await this.users.findOne({ where: { email } });
      if (!user) {
        return [false, 'User not found'];
      }
      const isPasswordValid = await user.checkPassword(password);

      if (!isPasswordValid) {
        return [false, 'Wrong password'];
      }
      const payload: jwt.JwtPayload = { id: user.id };
      const secretKey = this.configService.get<string>('SECRET_KEY');

      const expiresIn = this.configService.get<string>('EXPIRES_IN');
      if (!secretKey || !expiresIn) {
        return [false, 'JWT secret key And ExpireIn is not defined'];
      }

      const accessToken = this.jwtService.sign(payload);

      return [true, 'login Sucessfully', accessToken];
    } catch (e) {
      console.log(e);
      return [false, "Couldn't log user in"];
    }
  }
}
