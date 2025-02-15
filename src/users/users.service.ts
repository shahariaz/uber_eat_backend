import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dtos/create-account.dto';
import * as bcrypt from 'bcrypt';
import { error } from 'console';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
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
      return [true];
    } catch (e) {
      return [false, "Couldn't log user in"];
    }
  }
}
